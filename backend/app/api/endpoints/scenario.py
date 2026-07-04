import shutil
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.app.schemas.scenario import ScenarioResponse
from backend.app.services.scenario_service import ScenarioService

router = APIRouter()

service = ScenarioService()


@router.post(
    "/simulate",
    response_model=ScenarioResponse
)
async def simulate(
    file: UploadFile = File(...)
):

    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported."
        )

    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)

    file_path = upload_dir / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    scenarios = service.simulate(str(file_path))

    output_dir = Path("output/scenarios")
    output_dir.mkdir(parents=True, exist_ok=True)

    saved_files = {}

    for name, df in scenarios.items():

        file_name = output_dir / f"{name}.csv"

        df.to_csv(
            file_name,
            index=False
        )

        saved_files[name] = str(file_name)

    return {
        "success": True,
        "message": "Scenario simulation completed successfully.",
        "scenarios_generated": len(saved_files),
        "files": saved_files,
    }