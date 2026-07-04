from pydantic import BaseModel


class BudgetResponse(BaseModel):
    success: bool
    message: str
    rows_processed: int
    recommendations_generated: int
    output_file: str