CREATE TABLE llm_provider
(
    `id`           INT AUTO_INCREMENT PRIMARY KEY,
    `uuid`         VARCHAR(50) UNIQUE NOT NULL DEFAULT (UUID()),
    user_uuid      VARCHAR(50)        NOT NULL,
    `name`         VARCHAR(255)       NOT NULL UNIQUE,                                                                   -- 名称（唯一约束）
    api_key        VARCHAR(255),                                                                                         -- API密钥（建议加密存储）
    api_url        VARCHAR(512),                                                                                         -- API地址
    document_url   VARCHAR(512),                                                                                         -- 文档URL
    `status`       INT                         DEFAULT 1,
    llm_model_url  VARCHAR(512),                                                                                         -- 模型URL
    `created_time` DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',                             -- Automatically set the current timestamp when a record is created
    `updated_time` DATETIME                    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间', -- Automatically set and update the timestamp when a record is modified
    FOREIGN KEY (user_uuid) REFERENCES sys_user (`uuid`)
);



INSERT IGNORE INTO llm_provider (user_uuid,
                          name,
                          api_key,
                          api_url,
                          document_url,
                          llm_model_url)
VALUES ('af4c804f-3966-4949-ace2-3bb7416ea926', 'NO.1 API', 'sk-1234567890abcdef', 'https://api.rcouyi.com',
        'https://apifox.com/apidoc/shared-a7668f05-b561-4ab3-9f93-9798942d810c', 'https://api.rcouyi.com/v1/models'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', 'OpenAI', 'sk-1234567890abcdef', 'https://api.openai.com',
        'https://platform.openai.com/docs', 'https://api.openai.com/v1/models'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', 'Anthropic', 'sk-abcdef1234567890', 'https://api.anthropic.com',
        'https://docs.anthropic.com', 'https://api.anthropic.com/v1/models'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', 'Cohere', 'sk-0987654321abcdef', 'https://api.cohere.ai',
        'https://docs.cohere.ai', 'https://api.cohere.ai/v1/models'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', '硅基流动', 'sk-0987654321abcdef', 'https://api.siliconflow.cn',
        'https://docs.siliconflow.cn', 'https://api.siliconflow.cn/v1/models'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', 'O3', 'sk-0987654321abcdef', 'https://api.o3.fan',
        'https://docs.o3.fan/', 'https://docs.o3.fan/models'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', 'AiHubMix', 'sk-0987654321abcdef', 'https://aihubmix.com',
        'https://doc.aihubmix.com/', 'https://aihubmix.com/models'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', 'DeepSeek', 'sk-0987654321abcdef', 'https://api.deepseek.com',
        'https://api-docs.deepseek.com/', 'https://api.deepseek.com'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', 'ocoolAI', 'sk-0987654321abcdef', 'https://api.ocoolai.com',
        'https://docs.ocoolai.com/', 'https://api.ocoolai.com/info/models/'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', '百度云千帆', 'sk-0987654321abcdef', 'https://qianfan.baidubce.com/v2/',
        'https://cloud.baidu.com/doc/index.html', 'https://qianfan.baidubce.com/v2'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', 'Ollama', 'sk-0987654321abcdef', 'http://localhost:11434',
        'https://github.com/ollama/ollama/tree/main/docs', 'https://ollama.com/library'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', 'LM Studio', 'sk-0987654321abcdef', 'http://localhost:1234',
        'https://lmstudio.ai/docs', 'https://lmstudio.ai/models'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', 'Azure OpenAI', 'sk-0987654321abcdef', 'https://api.anthropic.com/',
        'https://docs.anthropic.com/en/docs/', 'https://docs.anthropic.com/en/docs/about-claude/models/all-models'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', 'Gemini', 'sk-0987654321abcdef',
        'https://generativelanguage.googleapis.com', 'https://ai.google.dev/gemini-api/docs',
        'https://ai.google.dev/gemini-api/docs/models/gemini'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', 'GitHub Models', 'sk-0987654321abcdef',
        'https://models.inference.ai.azure.com/', 'https://docs.github.com/en/github-models',
        'https://github.com/marketplace/models'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', 'DMXAPI', 'sk-0987654321abcdef', 'https://www.dmxapi.cn',
        'https://dmxapi.cn/models.html#code-block', 'https://www.dmxapi.cn/pricing'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', '零一万物', 'sk-0987654321abcdef', 'https://api.lingyiwanwu.com',
        'https://platform.lingyiwanwu.com/docs', 'https://platform.lingyiwanwu.com/docs#%E6%A8%A1%E5%9E%8B'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', '智谱AI', 'sk-0987654321abcdef',
        'https://open.bigmodel.cn/api/paas/v4/', 'https://open.bigmodel.cn/dev/howuse/introduction',
        'https://open.bigmodel.cn/modelcenter/square'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', '月之暗面', 'sk-0987654321abcdef', 'https://api.moonshot.cn',
        'https://platform.moonshot.cn/docs/intro',
        'https://platform.moonshot.cn/docs/intro#%E6%A8%A1%E5%9E%8B%E5%88%97%E8%A1%A8'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', '百川', 'sk-0987654321abcdef', 'https://api.baichuan-ai.com',
        'https://platform.baichuan-ai.com/docs', 'https://platform.baichuan-ai.com/price'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', '阿里云百炼', 'sk-0987654321abcdef',
        'https://dashscope.aliyuncs.com/compatible-mode/v1/',
        'https://help.aliyun.com/zh/model-studio/getting-started/',
        'https://bailian.console.aliyun.com/model-market#/model-market'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926', '火山引擎', 'sk-0987654321abcdef',
        'https://ark.cn-beijing.volces.com/api/v3/', 'https://www.volcengine.com/docs/82379/1182403',
        'https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926','OpenRouter', 'sk-0987654321abcdef' ,'https://openrouter.ai/api/v1/','https://openrouter.ai/docs/','https://openrouter.ai/docs/models'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926','腾讯混元','sk-0987654321abcdef','https://api.hunyuan.cloud.tencent.com','https://cloud.tencent.com/document/product/1729/111007','https://cloud.tencent.com/document/product/1729/104753'),
       ('af4c804f-3966-4949-ace2-3bb7416ea926','腾讯云TI','sk-0987654321abcdef','https://api.lkeap.cloud.tencent.com','https://cloud.tencent.com/document/product/1772','https://console.cloud.tencent.com/tione/v2/aimarket')

;


CREATE TABLE llm_model
(
    `id`           INT AUTO_INCREMENT PRIMARY KEY,
    `uuid`         VARCHAR(50) UNIQUE NOT NULL DEFAULT (UUID()),
    type           VARCHAR(50)        NOT NULL,                                                                          -- 模型类型（如：text-generation/image-generation）
    `name`         VARCHAR(255)       NOT NULL,                                                                          -- 模型名称
    group_name     VARCHAR(100),                                                                                         -- 分组名称
    `status`       INT                         DEFAULT 1,
    provider_uuid  VARCHAR(50)        NOT NULL,                                                                          -- 外键关联提供商
    `created_time` DATETIME           NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',                             -- Automatically set the current timestamp when a record is created
    `updated_time` DATETIME                    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间', -- Automatically set and update the timestamp when a record is modified
    FOREIGN KEY (provider_uuid) REFERENCES llm_provider (`uuid`)
);


INSERT IGNORE INTO llm_model (provider_uuid, status, type, group_name, name)
VALUES ('7078359a-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'GPT-4o', 'GPT-4o'),
       ('7078359a-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'GPT-4o', 'GPT-4o-mini'),
       ('7078359a-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'gpt-4.5', 'gpt-4.5-preview'),
       ('7078359a-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'o1', 'o1-mini'),
       ('7078359a-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'o1', 'o1-preview'),
       ('70785ac5-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'DeepSeek Chat', 'DeepSeek Chat'),
       ('70785ac5-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'DeepSeek Reasoner', 'DeepSeek Reasoner'),
       ('70785d1d-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'DeepSeek', 'DeepSeek R1'),
       ('70785d1d-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'DeepSeek', 'DeepSeek V3'),
       ('70785d1d-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'ERNIE', 'ERNIE-4.0'),
       ('70785d1d-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'ERNIE', 'ERNIE-4.0 Trubo'),
       ('70785d1d-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'ERNIE', 'ERNIE Speed'),
       ('70785d1d-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'ERNIE', 'ERNIE Lite'),
       ('70785d1d-fb64-11ef-b16d-025085b610e4', 1, 'embedding', 'Embedding', 'BGE Large ZH'),
       ('70785d1d-fb64-11ef-b16d-025085b610e4', 1, 'embedding', 'Embedding', 'BGE Large EN'),
       ('707862f2-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'Gemini 1.5', 'Gemini 1.5 Flash'),
       ('707862f2-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'Gemini 1.5', 'Gemini 1.5 Flash (8B)'),
       ('707862f2-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'Gemini 1.5', 'Gemini 1.5 Pro'),
       ('707862f2-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'Gemini 2.0', 'Gemini 2.0 Flash'),
       ('70786439-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'OpenAI', 'OpenAI GPT-4o'),
       ('7078655f-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'Claude', 'claude-3-5-sonnet-20241022'),
       ('7078655f-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'DeepSeek', 'DMXAPI-DeepSeek-R1'),
       ('7078655f-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'DeepSeek', 'DMXAPI-DeepSeek-V3'),
       ('7078655f-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'Gemini', 'gemini-2.0-flash'),
       ('7078655f-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'OpenAI', 'gpt-4o'),
       ('7078655f-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'OpenAI', 'gpt-4o-mini'),
       ('7078655f-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', '免费模型', 'Qwen/Qwen2.5-7B-Instruct'),
       ('7078655f-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', '免费模型', 'ERNIE-Speed-128K'),
       ('7078655f-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', '免费模型', 'THUDM/glm-4-9b-chat'),
       ('7078655f-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', '免费模型', 'glm-4-flash'),
       ('7078655f-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', '免费模型', 'hunyuan-lite'),
       ('7078655f-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'OpenAI', 'OpenAI GPT-4o'),
       ('7078655f-fb64-11ef-b16d-025085b610e4', 1, 'text-generation', 'OpenAI', 'OpenAI GPT-4o'),
       ('bbf55613-fbfa-11ef-b650-025085b610e4', 1, 'text-generation', 'OpenAI', 'OpenAI GPT-4o'),
       (),
       (),
       (),
       (),
       (),
       (),
       (),
       ()
;