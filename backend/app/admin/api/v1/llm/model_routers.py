from typing import Annotated
from fastapi import APIRouter, Query, Request, HTTPException, status, Path

from backend.app.admin.schema import CreateLlmModelParam, UpdateLlmModelParam, LlmModelListSchema
from backend.app.admin.service.llm_model_service import LlmModelService
from backend.common.response.response_schema import ResponseModel, response_base
from backend.common.security.jwt import DependsJwtAuth
from backend.utils.serializers import select_as_dict

router = APIRouter()


@router.get('/all', summary='查看所有模型', dependencies=[DependsJwtAuth])
async def get_all_model(
    request: Request,
    llm_provider_uuid: Annotated[str | None, Query(description="提供商UUID检索")] = None,
) -> ResponseModel:
    """获取所有模型（支持条件筛选）"""
    try:
        models = await LlmModelService.get_all(llm_provider_uuid=llm_provider_uuid)
        data = [LlmModelListSchema(**select_as_dict(model)) for model in models]
        return response_base.success(data=data)
    except Exception as e:
        return response_base.fail(
            data=str(e)
        )


@router.post('', summary='添加模型', dependencies=[DependsJwtAuth])
async def create_llm_model(
    request: Request,
    obj: CreateLlmModelParam
) -> ResponseModel:
    """创建新模型"""
    try:
        new_model = await LlmModelService.add(obj=obj)
        data = LlmModelListSchema(**select_as_dict(new_model))
        print(data)
        return response_base.success(data=data)
    except ValueError as e:
        return response_base.fail(data=str(e))
    except Exception as e:
        return response_base.fail(data=f"创建失败: {str(e)}")


@router.get('/{llm_model_uuid}/detail', summary='获取模型详细信息', dependencies=[DependsJwtAuth])
async def get_llm_model(
    request: Request,
    llm_model_uuid: Annotated[str, Path(..., description="提供商UUID")]
) -> ResponseModel:
    """获取模型详情（包含关联模型）"""
    try:
        model = await LlmModelService.get_detail(llm_model_uuid)
        data = LlmModelListSchema(**select_as_dict(model))
        return response_base.success(data=data)
    except HTTPException as e:
        return response_base.fail(data=e.detail)
    except Exception as e:
        return response_base.fail(data=str(e))


@router.delete('', summary='删除模型', dependencies=[DependsJwtAuth])
async def delete_llm_model(
    request: Request,
    llm_model_uuid: Annotated[str, Query(description="模型UUID")]
) -> ResponseModel:
    """删除指定模型"""
    try:
        success = await LlmModelService.delete(llm_model_uuid=llm_model_uuid)
        if success:
            return response_base.success(data="模型删除成功")
    except HTTPException as e:
        return response_base.fail(data=e.detail)
    except Exception as e:
        return response_base.fail(data=f"删除失败: {str(e)}")


@router.put('/{llm_model_uuid}', summary='更新模型', dependencies=[DependsJwtAuth])
async def update_llm_model(
    request: Request,
    llm_model_uuid: Annotated[str, Path(description="要更新的模型UUID")],
    obj: UpdateLlmModelParam
) -> ResponseModel:
    """更新模型信息"""
    try:
        updated_model = await LlmModelService.update(
            llm_model_uuid=llm_model_uuid,
            obj=obj
        )
        data = LlmModelListSchema(**select_as_dict(updated_model))
        return response_base.success(data=data)
    except ValueError as e:
        return response_base.fail(data=str(e))
    except Exception as e:
        return response_base.fail(data=f"更新失败: {str(e)}")
