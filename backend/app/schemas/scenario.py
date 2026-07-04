from pydantic import BaseModel


class ScenarioResponse(BaseModel):
    success: bool
    message: str
    scenarios_generated: int
    files: dict[str, str]