import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const { Option } = Select;

const AddUserModal = ({ visible, onCancel, onCreate }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                onCreate(values); // 调用父组件的创建方法
                form.resetFields(); // 提交后重置表单
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="添加用户"
            visible={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
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
                name="add_user_form"
                initialValues={{
                    department: [],
                    role: [],
                }}
            >
                <Form.Item
                    name="department"
                    label="部门"
                    rules={[{ required: true, message: '请选择至少一个部门' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="请选择部门"
                    >
                        <Option value="test">Test</Option>
                        <Option value="dev">Development</Option>
                        <Option value="hr">HR</Option>
                        <Option value="finance">Finance</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[{ required: true, message: '请输入用户名' }]}
                >
                    <Input placeholder="请输入用户名" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="密码"
                    rules={[{ required: true, message: '请输入密码' }]}
                >
                    <Input.Password
                        placeholder="请输入密码"
                        iconRender={(visible) =>
                            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '请输入有效的邮箱地址' },
                    ]}
                >
                    <Input placeholder="请输入邮箱" />
                </Form.Item>

                <Form.Item
                    name="role"
                    label="角色"
                    rules={[{ required: true, message: '请选择至少一个角色' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="请选择角色"
                    >
                        <Option value="admin">管理员</Option>
                        <Option value="editor">编辑</Option>
                        <Option value="viewer">查看者</Option>
                        <Option value="user">用户</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddUserModal;
