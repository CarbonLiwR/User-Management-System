#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from contextlib import asynccontextmanager

from asgi_correlation_id import CorrelationIdMiddleware
from fastapi import Depends, FastAPI
from fastapi_limiter import FastAPILimiter
from fastapi_pagination import add_pagination
from starlette.middleware.authentication import AuthenticationMiddleware

from backend.app.router import route
from backend.common.exception.exception_handler import register_exception
from backend.common.log import set_customize_logfile, setup_logging
from backend.core.conf import settings
from backend.core.path_conf import STATIC_DIR
from backend.database.db_mysql import create_table
from backend.database.db_redis import redis_client
from backend.middleware.jwt_auth_middleware import JwtAuthMiddleware
from backend.middleware.opera_log_middleware import OperaLogMiddleware
from backend.middleware.state_middleware import StateMiddleware
from backend.utils.demo_site import demo_site
from backend.utils.health_check import ensure_unique_route_names, http_limit_callback
from backend.utils.openapi import simplify_operation_ids
from backend.utils.serializers import MsgSpecJSONResponse
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def register_init(app: FastAPI):
    """
    启动初始化

    :return:
    """
    await create_table()
    # 连接 redis
    await redis_client.open()
    # 初始化 limiter
    await FastAPILimiter.init(
        redis=redis_client, prefix=settings.REQUEST_LIMITER_REDIS_PREFIX, http_callback=http_limit_callback
    )

    yield

    # 关闭 redis 连接
    await redis_client.close()
    # 关闭 limiter
    await FastAPILimiter.close()



def register_app():
    # FastAPI
    app = FastAPI(
        title=settings.FASTAPI_TITLE,
        version=settings.FASTAPI_VERSION,
        description=settings.FASTAPI_DESCRIPTION,
        docs_url=settings.FASTAPI_DOCS_URL,
        redoc_url=settings.FASTAPI_REDOCS_URL,
        openapi_url=settings.FASTAPI_OPENAPI_URL,
        default_response_class=MsgSpecJSONResponse,
        lifespan=register_init,  # 暂时移除 lifespan，调试问题
    )

    origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        # 其他允许的源可以在这里添加
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,  # 允许访问的源
        allow_credentials=True,
        allow_methods=["*"],  # 允许的方法
        allow_headers=["*"],  # 允许的请求头
    )

    # 日志
    register_logger()

    # 静态文件
    register_static_file(app)

    # 中间件
    register_middleware(app)

    # 路由
    register_router(app)

    # 分页
    register_page(app)

    # 全局异常处理
    register_exception(app)

    return app



def register_logger() -> None:
    """
    系统日志

    :return:
    """
    setup_logging()
    set_customize_logfile()


def register_static_file(app: FastAPI):
    """
    静态文件交互开发模式, 生产使用 nginx 静态资源服务

    :param app:
    :return:
    """
    if settings.FASTAPI_STATIC_FILES:
        import os

        from fastapi.staticfiles import StaticFiles

        if not os.path.exists(STATIC_DIR):
            os.mkdir(STATIC_DIR)
        app.mount('/static', StaticFiles(directory=STATIC_DIR), name='static')


def register_middleware(app: FastAPI):
    """
    中间件，执行顺序从下往上

    :param app:
    :return:
    """
    # Opera log (required)
    app.add_middleware(OperaLogMiddleware)
    # JWT auth (required)
    app.add_middleware(
        AuthenticationMiddleware, backend=JwtAuthMiddleware(), on_error=JwtAuthMiddleware.auth_exception_handler
    )
    # Access log
    if settings.MIDDLEWARE_ACCESS:
        from backend.middleware.access_middleware import AccessMiddleware

        app.add_middleware(AccessMiddleware)
    # State
    app.add_middleware(StateMiddleware)
    # Trace ID (required)
    app.add_middleware(CorrelationIdMiddleware, validator=False)
    # CORS: Always at the end
    if settings.MIDDLEWARE_CORS:
        from fastapi.middleware.cors import CORSMiddleware

        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.CORS_ALLOWED_ORIGINS,
            allow_credentials=True,
            allow_methods=['*'],
            allow_headers=['*'],
            expose_headers=settings.CORS_EXPOSE_HEADERS,
        )


def register_router(app: FastAPI):
    """
    路由

    :param app: FastAPI
    :return:
    """
    dependencies = [Depends(demo_site)] if settings.DEMO_MODE else None

    # API
    app.include_router(route, dependencies=dependencies)

    # Extra
    ensure_unique_route_names(app)
    simplify_operation_ids(app)


def register_page(app: FastAPI):
    """
    分页查询

    :param app:
    :return:
    """
    add_pagination(app)
