import {useEffect, useState, useRef} from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    Select,
    message,
    List,
    Row,
    Col,
    Tag,
    Switch,
    Layout,
    Menu,
    Spin,
    Card, Avatar
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    ApiOutlined,
    CloudServerOutlined, RobotOutlined
} from '@ant-design/icons';
import './index.css'
// 自定义hooks和类型
import {useDispatchLLMProvider, useLLMProviderSelector} from "../../../hooks/llmProvider.ts";
import {useDispatchLLMModel, useLLMModelSelector} from "../../../hooks/llmModel.ts";
import {LLMModelRes} from "../../../types/llmModelType.ts";
import {Link} from "react-router-dom";
import axios from 'axios';

const {Sider, Content, Header} = Layout;

const EditSettingsModal = () => {
    const [form] = Form.useForm();
    const [selectedProviderUuid, setSelectedProviderUuid] = useState('');
    const [showProviderForm, setShowProviderForm] = useState(false);
    const [showModelCreateForm, setShowModelCreateForm] = useState(false);
    const [showModelUpdateForm, setShowModelUpdateForm] = useState(false);
    const [currentModel, setCurrentModel] = useState<LLMModelRes | null>(null);
    const dispatch = useDispatchLLMProvider();
    const modelDispatch = useDispatchLLMModel();
    const {providers, status} = useLLMProviderSelector(state => state.llmProvider);
    const providerDetail = useLLMProviderSelector(state => state.llmProvider.providerDetail);
    const {models} = useLLMModelSelector(state => state.llmModel);
    const [testloading, setTestloading] = useState(false); // 添加 loading 状态
    const menuRef = useRef<HTMLDivElement>(null);// 获取 Menu 的 DOM 引用
    const contentRef = useRef<HTMLDivElement>(null);
    // 提交服务商配置
    const handleProviderSubmit = async (values: any) => {
        try {
            if (providerDetail) {
                await dispatch.updateLLMProviderInfo(providerDetail.uuid, values);
                message.success('服务商配置更新成功');
            }
        } catch (error) {
            message.error('配置更新失败');
        }
    };
    // 测试配置
    const handleTestConfig = async () => {
        const values = form.getFieldsValue();
        const {api_key, api_url} = values; // 确保 api_url 有值
        const status = providerDetail ? providerDetail.status : 0;

        // console.log("status", status);
        // console.log("api_url", api_url);

        // 获取 status 为 1 的模型 name
        const activeModel = models.items.find(model => model.status === 1);
        // console.log('activeModel', activeModel);

        if (!status) {
            message.error('没有启用服务商');
            return;
        }
        if (!api_key) {
            message.error('没有设置API密钥');
            return;
        }
        if (!api_url) {
            message.error('没有设置API地址');
            return;
        }
        if (!activeModel) {
            message.error('没有启用的模型');
            return;
        }
        setTestloading(true); // 开始加载，按钮变为旋转状态
        try {

            // console.log(api_key, api_url, activeModel.name);
            const response = await axios.get('api/v1/llm/create/test', {
                params: {
                    base_url: api_url,
                    api_key: api_key,
                    model_name: activeModel.name,
                },
            });
            console.log(response);
            if (response.message == "api_key test successfully.") {
                message.success("恭喜您的配置有效，Let's go"); // 使用后端返回的 message
            } else {
                message.error("您的配置无效，建议查看API是否正确且有额度。以及当前模型是否有效"); // 使用后端返回的 message
            }
        } catch (error) {
            if (error.response) {
                console.error('Error Response:', error.response.data);
                message.error(`配置测试失败: ${error.response.data.message || '未知错误'}`);
            } else if (error.request) {
                console.error('No Response:', error.request);
                message.error('配置测试失败，请检查网络连接');
            } else {
                console.error('Error:', error.message);
                message.error('配置测试失败，请检查配置');
            }
        } finally {
            setTestloading(false);
        }
    };
    // 添加新模型
    const handleAddModel = async (values: any) => {
        try {
            await modelDispatch.addLLMModel({
                ...values,
                status: 0,
                provider_uuid: selectedProviderUuid
            });
            message.success('模型添加成功');
            setShowModelCreateForm(false);
        } catch (error) {
            message.error('模型添加失败');
        }
    };
    // 监听 selectedProviderUuid 的变化，滚动到顶部
    // 获取 Content 的 DOM 引用
    const handleUpdateModel = async (values: any) => {
        if (!currentModel) return;
        try {
            await modelDispatch.updateLLMModelInfo(currentModel.uuid, {
                ...values,
            });
            message.success('模型更新成功');
            setShowModelUpdateForm(false);
        } catch (error) {
            message.error('模型更新失败');
        }
    };

    const handleUpdateClick = async (values: LLMModelRes) => {
        setCurrentModel(values);
        // console.log(values);
        setShowModelUpdateForm(true);
    };

    const loadProviderDetail = (uuid: string) => {
        dispatch.getLLMProviderDetail(uuid);
        modelDispatch.getAllLLMModels(uuid);
    };
    // 服务商菜单项
    const providerMenuItems = [...providers.items] // 创建数组的浅拷贝
        .sort((a, b) => b.status - a.status) // 对拷贝的数组进行排序
        .map(p => ({
            key: p.uuid,
            label: (
                <div className="provider-menu-item">
                    <ApiOutlined/>
                    <span className="provider-name">{p.name}</span>
                    <Tag color={p.status === 1 ? 'green' : 'red'} className="status-tag">
                        {p.status === 1 ? '已启用' : '已禁用'}
                    </Tag>
                </div>
            )
        }));


    // console.log('providerDetail', providerDetail);

    const handleSelectProvider = (uuid: string) => {
        setSelectedProviderUuid(uuid);
        // 重置表单避免旧数据残留
        form.resetFields();
        // 加载新数据
        loadProviderDetail(uuid);

    };

    const handleProviderStatusChange = async (checked: boolean) => {
        if (providerDetail) {
            if (checked) {
                // 滚动到顶部
                if (menuRef.current) {
                    menuRef.current.scrollTo({top: 0, behavior: 'smooth'}); // 平滑滚动到顶部
                }
                const openProvider = providers.items.find((item) => item.status === 1 && item.uuid !== providerDetail.uuid);
                if (openProvider) {
                    message.info(`不能同时开启多个服务商，请先关闭 ${openProvider.name}`);
                    return; // 如果已经有开启的服务商，直接返回，不执行后续操作
                }
            }

            dispatch.updateLLMProviderInfo(providerDetail.uuid, {
                status: checked ? 1 : 0
            });
        }
    };

    const handleModelStatusChange = async (model_uuid: string, checked: boolean) => {
        if (models) {
            if (checked) {
                const openModel = models.items.find((item) => item.status === 1 && item.uuid !== model_uuid);
                if (openModel) {
                    message.info(`不能同时开启多个模型，请先关闭 ${openModel.name}`);
                    return; // 如果已经有开启的服务商，直接返回，不执行后续操作
                }
            }
            modelDispatch.updateLLMModelInfo(model_uuid, {status: checked ? 1 : 0})
        }
    };
    // 对模型列表进行排序，已启用的模型排在前面
    const sortedModels = [...models.items].sort((a, b) => b.status - a.status);

    useEffect(() => {
        dispatch.getAllLLMProviders();
    }, []);
    // 修复初始加载逻辑
    useEffect(() => {
        if (providers.items.length > 0 && selectedProviderUuid === '') {
            // 查找已启用的服务商
            const enabledProvider = providers.items.find(p => p.status === 1);
            if (enabledProvider) {
                handleSelectProvider(enabledProvider.uuid); // 默认选中已启用的服务商
            } else {
                const firstProvider = providers.items[0];
                handleSelectProvider(firstProvider.uuid); // 如果没有已启用的服务商，则选中第一个
            }
        }
    }, [providers.items]);

    useEffect(() => {
        if (providerDetail) {
            form.setFieldsValue({
                api_key: providerDetail.api_key,
                api_url: providerDetail.api_url,
                document_url: providerDetail.document_url,
                model_url: providerDetail.llm_model_url
            });
        }
    }, [providerDetail, form]);
    // 监听 models.items 的变化，检查是否有模型的 status 变为 1
    useEffect(() => {
        if (contentRef.current && models.items) {
            // 检查是否有模型的 status 变为 1
            const enabledModel = models.items.find(model => model.status === 1);
            if (enabledModel) {
                contentRef.current.scrollTo({top: 0, behavior: 'smooth'}); // 平滑滚动到顶部
            }
        }
    }, [models.items]); // 监听 models.items 的变化

    return (
        <Layout style={{height: '80vh'}}>
            {/* 左侧服务商列表 */}
            <Sider width="30%" theme="light" style={{height: '100%'}}>
                <div className="provider-list" style={{height: '100%'}}>
                    <div className="list-header">
                        <h3>已配置服务商</h3>
                        {/*<Button*/}
                        {/*    type="primary"*/}
                        {/*    icon={<PlusOutlined />}*/}
                        {/*    onClick={() => setShowProviderForm(true)}*/}
                        {/*>*/}
                        {/*    新建服务商*/}
                        {/*</Button>*/}
                    </div>
                    <div style={{height: 'calc( 100% - 80px )', overflowY: 'auto'}}
                         ref={menuRef}>

                        <Menu
                            mode="inline"
                            selectedKeys={[selectedProviderUuid]}
                            items={providerMenuItems}
                            onSelect={({key}) => handleSelectProvider(key)}
                        />
                    </div>
                </div>
            </Sider>

            {/* 右侧配置面板 */}
            <Layout style={{height: '92%'}}>
                <Header style={{background: '#fff', padding: '0 24px'}}>
                    <Row justify="space-between" align="middle">
                        <Col>
                            <h2>
                                <CloudServerOutlined/>
                                {providerDetail?.name || '服务商配置'}
                            </h2>
                        </Col>
                        <Col>
                            <Switch
                                checked={!!providerDetail?.status}
                                onChange={checked => handleProviderStatusChange(checked)}
                            />
                        </Col>
                    </Row>
                </Header>
                <Content style={{margin: '24px', height: 'calc( 100% - 80px )', overflowY: 'auto'}}
                         ref={contentRef}
                >

                    {status === 'loading' ? (
                        <Spin tip="加载配置中..."/>
                    ) : (
                        <>
                            {/* 服务商配置表单 */}
                            <Card title="基础配置" variant={"borderless"}>
                                {providerDetail &&
                                    <Form
                                        form={form}
                                        initialValues={providerDetail}
                                        onFinish={handleProviderSubmit}
                                        layout="vertical"
                                    >
                                        <Row gutter={24}>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="API密钥"
                                                    name="api_key"
                                                >
                                                    <Input.Password placeholder="请输入API密钥"/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    label="API地址"
                                                    name="api_url"
                                                    rules={[{required: true, type: 'url'}]}
                                                >
                                                    <Input placeholder="https://api.example.com/v1"/>
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                保存配置
                                            </Button>
                                            <Button
                                                type="primary"
                                                style={{marginLeft: '10px'}}
                                                onClick={handleTestConfig}
                                                loading={testloading} // 绑定 loading 状态
                                            >
                                                测试配置
                                            </Button>
                                        </Form.Item>

                                        <Link to={providerDetail.document_url || ''} target="_blank"
                                              rel="noopener noreferrer">点击这里获取密钥</Link>
                                        <div>
                                            查看<Link to={providerDetail.document_url || ''} target="_blank"
                                                      rel="noopener noreferrer">{providerDetail.name}文档</Link>和
                                            <Link to={providerDetail.llm_model_url || ''} target="_blank"
                                                  rel="noopener noreferrer">模型</Link>
                                        </div>
                                    </Form>
                                }
                            </Card>

                            {/* 模型管理 */}
                            <Card
                                title="模型列表"
                                variant={"borderless"}
                                extra={
                                    <Button
                                        icon={<PlusOutlined/>}
                                        onClick={() => setShowModelCreateForm(true)}
                                    >
                                        添加模型
                                    </Button>
                                }
                                style={{marginTop: 24}}
                            >
                                <List
                                    dataSource={sortedModels} // 使用排序后的模型列表
                                    renderItem={model => (
                                        <List.Item
                                            actions={[
                                                <EditOutlined onClick={() => handleUpdateClick(model)}/>,
                                                <DeleteOutlined
                                                    onClick={() => modelDispatch.removeLLMModel(model.uuid)}/>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={<Avatar icon={<RobotOutlined/>}/>}
                                                title={model.name}
                                                description={
                                                    <>
                                                        <Tag>{model.type}</Tag>
                                                        {model.group_name &&
                                                            <Tag color="blue">{model.group_name}</Tag>}
                                                    </>
                                                }
                                            />
                                            <Switch
                                                checked={model.status === 1}
                                                onChange={checked =>
                                                    handleModelStatusChange(model.uuid, checked)
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </>
                    )}
                    {/* 新建服务商模态框 */}
                    <ProviderFormModal
                        visible={showProviderForm}
                        onClose={() => setShowProviderForm(false)}
                    />

                    {/* 模型配置模态框 */}
                    <ModelCreateFormModal
                        visible={showModelCreateForm}
                        onClose={() => {
                            setShowModelCreateForm(false);
                        }}
                        onSubmit={handleAddModel}
                    />

                    <ModelUpdateFormModal
                        visible={showModelUpdateForm}
                        initialValues={currentModel}
                        onClose={() => {
                            setShowModelUpdateForm(false);
                            setCurrentModel(null);
                        }}
                        onSubmit={handleUpdateModel}
                    />
                </Content>

            </Layout>
        </Layout>

    );
};

// 服务商表单模态框组件
const ProviderFormModal = ({visible, onClose}: { visible: boolean, onClose: () => void }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatchLLMProvider();

    const handleSubmit = async (values: any) => {
        try {
            await dispatch.addLLMProvider(values);
            message.success('服务商创建成功');
            onClose();
        } catch (error) {
            message.error('创建失败');
        }
    };

    return (
        <Modal
            title="新建服务商"
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item label="服务商名称" name="name" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

// 模型表单模态框组件
const ModelUpdateFormModal = ({visible, initialValues, onClose, onSubmit}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) form.setFieldsValue(initialValues);
    }, [initialValues]);

    return (
        <Modal
            title={initialValues ? '编辑模型' : '添加模型'}
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item label="模型名称" name="name" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="模型类型" name="type" rules={[{required: true}]}>
                    <Select options={[
                        {label: '文本生成', value: 'text-generation'},
                        {label: '图像生成', value: 'image-generation'},
                        {label: '视频生成', value: 'video-generation'},
                        {label: '文本嵌入', value: 'text-embedding'},
                    ]}/>
                </Form.Item>
                <Form.Item label="分组名称" name="group_name">
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

// 模型表单模态框组件
const ModelCreateFormModal = ({visible, onClose, onSubmit}) => {
    const [form] = Form.useForm();
    return (
        <Modal
            title={'添加模型'}
            open={visible}
            onCancel={onClose}
            onOk={() => form.submit()}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item label="模型名称" name="name" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item label="模型类型" name="type" rules={[{required: true}]}>
                    <Select options={[
                        {label: '文本生成', value: 'text-generation'},
                        {label: '图像生成', value: 'image-generation'},
                        {label: '视频生成', value: 'video-generation'},
                        {label: '文本嵌入', value: 'text-embedding'},
                    ]}/>
                </Form.Item>
                <Form.Item label="分组名称" name="group_name">
                    <Input/>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditSettingsModal;