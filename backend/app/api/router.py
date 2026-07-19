from fastapi import APIRouter

from backend.app.api.endpoints.prediction import router as prediction_router
from backend.app.api.endpoints.insights import router as insights_router
from backend.app.api.endpoints.budget import router as budget_router
from backend.app.api.endpoints.forecast import router as forecast_router
from backend.app.api.endpoints.scenario import router as scenario_router
from backend.app.api.endpoints.analyze import router as analyze_router
from backend.app.api.endpoints.dashboard import router as dashboard_router
from backend.app.api.endpoints.admin import router as admin_router
from backend.app.api.endpoints.upload import router as upload_router

api_router = APIRouter()


@api_router.get(
    "/health",
    tags=["Health"]
)
def health():

    return {
        "success": True,
        "status": "healthy",
        "service": "MarketMind AI Backend",
        "version": "1.0.0"
    }


api_router.include_router(
    prediction_router,
    tags=["Prediction"]
)

api_router.include_router(
    insights_router,
    tags=["Insights"]
)

api_router.include_router(
    budget_router,
    tags=["Budget Optimizer"]
)

api_router.include_router(
    forecast_router,
    tags=["Forecast"]
)

api_router.include_router(
    scenario_router,
    prefix="/scenario",
    tags=["Scenario Simulator"]
)

api_router.include_router(
    analyze_router,
    tags=["Complete Analysis"]
)

api_router.include_router(
    dashboard_router,
    tags=["Dashboard"]
)

api_router.include_router(
    admin_router,
    tags=["Admin"]
)

api_router.include_router(
    upload_router,
    tags=["Upload"]
)