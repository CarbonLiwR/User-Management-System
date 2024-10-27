import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Switch } from 'antd';

const { Option } = Select;

const EditDeptModal = ({ visible, onCancel, onEdit, dept, users = [] }) => {
    const [form] = Form.useForm();
    const [selectedUser, setSelectedUser] = useState(undefined); // 默认值为空

    // 如果传入了部门信息，预填充表单数据
    useEffect(() => {
        if (dept) {
            setSelectedUser(dept.leader || undefined); // 设置为部门负责人的昵称，若没有则为undefined
            form.setFieldsValue({
                name: dept.name,
                status: dept.status
            }); // 预填充其他表单数据
        }
    }, [dept]);

    // 点击确定按钮时，表单校验成功则提交数据
    const handleOk = () => {
        form
            .validateFields()
            .then((values) => {
                const selectedUserData = users.find((user) => user.nickname === selectedUser); // 查找选中的用户信息
                const dataToSubmit = {
                    ...values,
                    leader: selectedUser, // 负责人昵称
                    email: selectedUserData ? selectedUserData.email : '', // 负责人邮箱
                };
                onEdit(dataToSubmit);
                form.resetFields();
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            title="编辑部门"
            open={visible}
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
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="部门名称"
                    rules={[{ required: true, message: '请输入部门名称' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="负责人"
                    rules={[{ required: true, message: '请选择负责人' }]}
                >
                    <Select
                        style={{ width: '100%' }}
                        placeholder="请选择负责人"
                        value={selectedUser}
                        onChange={(newUsers) => {
                            setSelectedUser(newUsers);
                        }}
                    >
                        <Option value="">无</Option>
                        {users.map((user) => (
                            <Option key={user.id} value={user.nickname}>
                                {user.nickname}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="status"
                    label="状态"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="正常" unCheckedChildren="禁用" defaultChecked />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditDeptModal;
