import React, { useEffect } from 'react';
import {Modal, Form, Input, Button, Select, InputNumber} from 'antd';

const { Option } = Select;

const EditSettingsModal = ({ visible, onCancel, onCreate, user }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && user) {
            const settings=JSON.parse(user.settings);
            form.setFieldsValue({
                username: user.username || '',
                nickname: user.nickname || '',
                email: user.email || '',
                model_name: settings.model_name || 'sentence-transformers/all-MiniLM-L6-v2', // 设置默认值
                maxsize: settings.maxsize || '64', // 设置默认值
                api_key: settings.api_key || '',
            });
        }
    }, [visible, user, form]);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const pre_settings = {
                    api_key: values.api_key,
                    model_name: values.model_name,
                    maxsize: Number(values.maxsize), // 转换为数字
                };
                const settings =JSON.stringify(pre_settings);
                // console.log(settings);

                const formData = {
                    username: user?.username || '',
                    nickname: user?.nickname || '',
                    email: user?.email || '',
                    settings,
                };

                onCreate(formData);
                // console.log(formData);
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="更新用户配置"
            open={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    确定
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                name="edit_api_form"
            >
                <Form.Item name="username" hidden>
                    <Input />
                </Form.Item>
                <Form.Item name="nickname" hidden>
                    <Input />
                </Form.Item>
                <Form.Item name="email" hidden>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="model_name"
                    label="切块模型"
                    rules={[{ required: true, message: '请输入模型名称' }]}
                >
                    <Select placeholder="请选择模型名称" defaultValue="user">
                        <Option value="sentence-transformers/all-MiniLM-L6-v2">sentence-transformers/all-MiniLM-L6-v2</Option>
                        <Option value="sentence-transformers/all-MiniLM-L12-v2">sentence-transformers/all-MiniLM-L12-v2</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="maxsize"
                    label="最大切块大小"
                    rules={[
                        { required: true, message: '请输入最大切块大小' , type: 'number'},
                    ]}
                >
                    <InputNumber min={1} placeholder="请输入最大切块大小" defaultValue="64" />
                </Form.Item>

                <Form.Item
                    name="api_key"
                    label="API-KEY"
                    rules={[{ required: true, message: '请输入API-KEY' }]}
                >
                    <Input placeholder="请输入API-KEY" />
                </Form.Item>

                <p>
                    点击 <a href="https://api.rcouyi.com/" target="_blank" rel="noopener noreferrer">此处</a> 获取 API-KEY
                </p>
            </Form>
        </Modal>
    );
};

export default EditSettingsModal;