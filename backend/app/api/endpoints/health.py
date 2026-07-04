from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MarketMindAI Backend",
        "version": "1.0"
    }