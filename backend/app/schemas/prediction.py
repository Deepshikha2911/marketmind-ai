from pydantic import BaseModel

class PredictionResponse(BaseModel):
    success: bool
    message: str
    rows_processed: int
    predictions_generated: int
    output_file: str