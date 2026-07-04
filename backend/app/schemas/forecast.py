from pydantic import BaseModel


class ForecastResponse(BaseModel):
    success: bool
    message: str
    rows_processed: int
    forecast_rows: int
    output_file: str