// 基础模型接口
export interface LLMModel {
    type: string;
    name: string;
    group_name?: string;
    status: number;
}

// 完整响应接口
export interface LLMModelRes extends LLMModel {
    id: number;
    uuid: string;
    provider_uuid: string;
    created_time: string;
    updated_time: string;
}

// 详情接口（包含提供商信息）
export interface LLMModelDetail extends LLMModelRes {
    provider_info: LLMProviderSimple; // 关联提供商基础信息
}

// 分页结构
export interface LLMModelPagination {
    items: LLMModelRes[];
    links: string[];
    total: number;
    page: number;
    size: number;
    total_pages: number;
}

// 查询参数
export interface GetLLMModelListParam {
    page?: number;
    size?: number;
    type?: string;    // 按类型过滤
    group_name?: string;    // 按分组过滤
    provider_uuid?: string; // 按提供商过滤
}

// 创建请求体
export interface LLMModelCreateReq {
    provider_uuid: string;  // 必须关联提供商
    type: string;
    name: string;
    group_name?: string;
    status: number;
}

// 更新请求体
export interface LLMModelUpdateReq {
    type?: string;
    name?: string;
    group_name?: string | null; // 允许清空分组
    status?: number;
}

// 简单提供商接口（用于嵌套）
export interface LLMProviderSimple {
    uuid: string;
    name: string;
    api_url: string;
}

// 状态管理
export interface LLMModelState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    models: LLMModelPagination;
    modelDetail: LLMModelDetail | null;
}

// 分组操作参数
export interface ModelGroupOperation {
    target_group: string;          // 目标分组名
    model_uuids: string[];         // 要操作的模型UUID列表
}