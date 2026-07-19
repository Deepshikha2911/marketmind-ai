import shutil
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, Query, UploadFile

from backend.app.schemas.scenario import ScenarioResponse
from backend.app.services.scenario_service import ScenarioService
from backend.app.services.upload_service import UploadService
from ml.preprocessing.preprocessing import DataPreprocessor

router = APIRouter()

service = ScenarioService()
upload_service = UploadService()


@router.post(
    "/simulate",
    response_model=ScenarioResponse,
)
async def simulate(
    file: UploadFile | None = File(default=None),
    filename: str | None = None,
    scenario_id: str = Query(default="increase-budget"),
):
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)

    if file is not None:
        if not file.filename or not file.filename.lower().endswith(".csv"):
            raise HTTPException(status_code=400, detail="Only CSV files are supported.")
        file_path = upload_dir / file.filename
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    else:
        if filename:
            file_path = upload_dir / filename
        else:
            current_upload = upload_service.get_current()
            if current_upload is None:
                raise HTTPException(status_code=404, detail="No uploaded CSV was found. Upload a file first.")
            file_path = upload_dir / current_upload.storedFilename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Uploaded CSV was not found on disk.")

    base_frame = service.loader.load_csv(str(file_path))
    base_frame = service.validator.validate(base_frame)
    base_frame = DataPreprocessor(base_frame).preprocess()
    base_frame = service.engineer.transform(base_frame)

    payload = service.simulate(str(file_path), scenario_id=scenario_id)

    output_dir = Path("output/scenarios")
    output_dir.mkdir(parents=True, exist_ok=True)

    saved_files = {}
    scenario_mapping = {
        "increase-budget": lambda frame: service.simulator.increase_budget(frame, 20),
        "reduce-budget": lambda frame: service.simulator.reduce_budget(frame, 20),
        "pause-campaigns": lambda frame: service.simulator.pause_campaign(frame),
        "increase-ctr": lambda frame: service.simulator.increase_ctr(frame, 15),
        "improve-conversion": lambda frame: service.simulator.improve_conversion_rate(frame, 15),
        "boost-revenue": lambda frame: service.simulator.boost_revenue(frame, 10),
    }

    for option in payload.get("options", []):
        option_id = option["id"]
        file_name = output_dir / f"{option_id}.csv"
        scenario_df = scenario_mapping.get(option_id, lambda frame: frame)(base_frame.copy())
        scenario_df.to_csv(file_name, index=False)
        saved_files[option_id] = str(file_name)

    payload["files"] = saved_files
    payload["scenarios_generated"] = len(saved_files)
    payload["message"] = "Scenario simulation completed successfully."
    return payload