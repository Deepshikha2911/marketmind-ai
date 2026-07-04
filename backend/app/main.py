from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.router import api_router
from backend.app.config.settings import settings

from backend.app.core.logging import setup_logging
from backend.app.exceptions.handlers import register_exception_handlers


# Initialize logging
setup_logging()


def create_app() -> FastAPI:
    """
    Application factory to create and configure the FastAPI instance.
    """

    app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        debug=settings.DEBUG,
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Exception Handlers
    register_exception_handlers(app)

    # API Routes
    app.include_router(
        api_router,
        prefix=settings.API_V1_STR,
    )

    return app


app = create_app()


import logging

logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup_event():
    logger.info("MarketMind AI Backend Started")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("MarketMind AI Backend Stopped")