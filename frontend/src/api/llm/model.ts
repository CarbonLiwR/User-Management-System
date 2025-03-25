import axios from '../interceptor';
import {
    LLMModelCreateReq,
    LLMModelDetail,
    LLMModelPagination,
    LLMModelRes,
    LLMModelUpdateReq,
    GetLLMModelListParam
} from "../../types/llmModelType";

// 获取所有模型（非分页）
export function queryLlmModelAll(providerUuid: string): Promise<LLMModelRes[]> {
    return axios.get('/api/v1/llm/model/all', {
        params: {
            llm_provider_uuid: providerUuid
        }
    });
}

// 获取模型详情（带关联模型）
export function queryLlmModelDetail(uuid: string): Promise<LLMModelDetail> {
    return axios.get(`/api/v1/llm/model/${uuid}/detail`);
}

// 获取模型列表（分页+过滤）
export function queryLlmModelList(params?: GetLLMModelListParam): Promise<LLMModelPagination> {
    return axios.get('/api/v1/llm/model', {
        params: {
            ...params,
            // 统一分页参数命名
            page: params?.page || 1,
            size: params?.size || 10
        }
    });
}

// 创建模型
export function createLlmModelAPI(data: LLMModelCreateReq): Promise<LLMModelRes> {
    return axios.post('/api/v1/llm/model', data);
}

// 更新模型信息
export function updateLlmModelAPI(uuid: string, data: LLMModelUpdateReq): Promise<LLMModelRes> {
    return axios.put(`/api/v1/llm/model/${uuid}`, data);
}

// 删除模型
export function deleteLlmModelAPI(uuid: string): Promise<void> {
    return axios.delete(`/api/v1/llm/model`, {
        params: {
            llm_model_uuid: uuid
        }
    });
}

// 设置模型状态
export function setLlmModelStatusAPI(uuid: string, status: number): Promise<void> {
    return axios.patch(`/api/v1/llm/model/${uuid}/status`, { status });
}
