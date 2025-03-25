import axios from '../interceptor';
import {
    LLMProviderCreateReq,
    LLMProviderDetail,
    LLMProviderPagination,
    LLMProviderRes,
    LLMProviderUpdateReq,
    GetLLMProviderListParam
} from "../../types/llmProviderType";

// 获取所有提供商（非分页）
export function queryLlmProviderAll(): Promise<LLMProviderRes[]> {
    return axios.get('/api/v1/llm/provider/all');
}

// 获取提供商详情（带关联模型）
export function queryLlmProviderDetail(uuid: string): Promise<LLMProviderDetail> {
    return axios.get(`/api/v1/llm/provider/${uuid}/detail`);
}

// 获取提供商列表（分页+过滤）
export function queryLlmProviderList(params?: GetLLMProviderListParam): Promise<LLMProviderPagination> {
    return axios.get('/api/v1/llm/provider', {
        params: {
            ...params,
            // 统一分页参数命名
            page: params?.page || 1,
            size: params?.size || 10
        }
    });
}

// 创建提供商
export function createLlmProviderAPI(data: LLMProviderCreateReq): Promise<LLMProviderRes> {
    return axios.post('/api/v1/llm/provider', data);
}

// 更新提供商信息
export function updateLlmProviderAPI(uuid: string, data: LLMProviderUpdateReq): Promise<LLMProviderRes> {
    return axios.put(`/api/v1/llm/provider/${uuid}`, data);
}

// 删除提供商
export function deleteLlmProviderAPI(uuid: string): Promise<void> {
    return axios.delete(`/api/v1/llm/provider`, {
        params: {
            llm_provider_uuid: uuid
        }
    });
}

// 设置提供商状态
export function setLlmProviderStatusAPI(uuid: string, status: number): Promise<void> {
    return axios.patch(`/api/v1/llm/provider/${uuid}/status`, { status });
}