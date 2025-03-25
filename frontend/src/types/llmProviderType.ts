export interface LLMProvider {
    name: string;
    api_key: string;
    api_url: string;
    document_url?: string;
    llm_model_url?: string;
    status: number;
}

export interface LLMProviderRes extends LLMProvider {
    id: number;
    uuid: string;
    user_uuid: string;
    created_time: string;
    updated_time: string;
}

export interface LLMProviderDetail extends LLMProviderRes {
    models: LLMModelSimple[]; // 关联的模型列表
}

export interface LLMProviderPagination {
    items: LLMProviderRes[];
    links: string[];
    total: number;
    page: number;
    size: number;
    total_pages: number;
}

export interface GetLLMProviderListParam {
    page?: number;
    size?: number;
    name?: string;       // 名称模糊搜索
    status?: number;     // 状态过滤
    user_uuid?: string;  // 用户过滤
}

export interface LLMProviderCreateReq {
    name: string;
}

export interface LLMProviderUpdateReq {
    name?: string;
    api_key?: string;
    api_url?: string;
    document_url?: string | null;
    model_url?: string | null;
    status?: number;
}

// 简单模型接口（用于嵌套展示）
export interface LLMModelSimple {
    uuid: string;
    model_name: string;
    model_type: string;
    status: number;
}

export interface LLMProviderState {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    providers: LLMProviderPagination;
    providerDetail: LLMProviderDetail | null;
}