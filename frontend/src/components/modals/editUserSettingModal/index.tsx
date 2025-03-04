import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Select } from 'antd';

const { Option } = Select;

const EditSettingModal = ({ visible, onCancel, onCreate, user }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && user) {
            form.setFieldsValue({
                username: user.username || '',
                nickname: user.nickname || '',
                email: user.email || '',
                model_name: user.model_name || 'sentence-transformers/all-MiniLM-L6-v2', // 设置默认值
                maxsize: user.maxsize || '64', // 设置默认值
            });
        }
    }, [visible, user, form]);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const setting = {
                    api_key: values.API_KEY,
                    model_name: values.model_name,
                    maxsize: Number(values.maxsize), // 转换为数字
                };

                const formData = {
                    username: user?.username || '',
                    nickname: user?.nickname || '',
                    email: user?.email || '',
                    setting,
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
                    <Select placeholder="请选择模型名称" defaultValue="sentence-transformers/all-MiniLM-L6-v2">
                        <Option value="sentence-transformers/all-MiniLM-L6-v2">sentence-transformers/all-MiniLM-L6-v2</Option>
                        <Option value="sentence-transformers/all-MiniLM-L12-v2">sentence-transformers/all-MiniLM-L12-v2</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="maxsize"
                    label="最大切块大小"
                    rules={[
                        { required: true, message: '请输入最大切块大小' },
                        { type: 'number', message: '必须输入数字', transform: value => Number(value) },
                    ]}
                >
                    <Input placeholder="请输入最大切块大小" defaultValue="64" />
                </Form.Item>

                <Form.Item
                    name="API_KEY"
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

export default EditSettingModal;