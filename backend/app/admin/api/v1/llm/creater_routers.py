from fastapi import  APIRouter

from backend.app.admin.service.llm_create_service import LlmCreateService
from backend.common.response.response_schema import ResponseModel, response_base

router = APIRouter()

@router.post("/providers/{user_uuid}", summary='添加LLM提供商')
async def add_llm_providers(user_uuid: str ) -> ResponseModel:
    """添加LLM提供商"""
    try:
        await LlmCreateService.add_llm_providers(user_uuid)
        return response_base.success(data={"message": "LLM providers added successfully."})
    except Exception as e:
        return response_base.fail(data=str(e))

@router.get("/test", summary='测试api_key')
async def test_api_key(base_url: str, api_key: str, model_name: str) -> ResponseModel:
    """测试api_key"""
    try:
        await LlmCreateService.test(base_url, api_key, model_name)
        return response_base.success(data={"message": "api_key test successfully."})
    except Exception as e:
        return response_base.fail(data=str(e))