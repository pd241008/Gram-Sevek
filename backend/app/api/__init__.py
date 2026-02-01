
from .health import router as health_router
from .nlp import router as nlp_router
from .login import router as login_router

__all__ = ["nlp_router", "health_router","login_router"]