import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Select} from 'antd';

const {Option} = Select;

const AddDeptModal = ({visible, onCancel, onCreate, users = []}) => {
    const [form] = Form.useForm();
    const [selectedUser, setSelectedUser] = useState(users.map((user) => user.nickname));

    useEffect(() => {
        setSelectedUser(users.map((user) => user.nickname));
        console.log(selectedUser);
    }, [users]);

    // 提交表单数据
    const handleSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                const selectedUserData = users.find((user) => user.nickname === selectedUser); // 根据选中的昵称查找用户信息
                if (selectedUserData) {
                    const dataToSubmit = {
                        ...values, // 包含表单中的其他字段
                        leader: selectedUserData.nickname, // 负责人昵称
                        email: selectedUserData.email, // 负责人邮箱
                    };
                    // console.log('Data to submit:', dataToSubmit); // 输出提交的数据
                    onCreate(dataToSubmit); // 调用 onEdit，传递提交的数据
                    form.resetFields(); // 重置表单
                } else {
                    console.error('No user selected or user not found');
                }
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };


    return (
        <Modal
            title="新增部门"
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}  // 点击确认时调用
            okText="提交"
            cancelText="取消"
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label="部门名称"
                    name="name"
                    rules={[{required: true, message: '请输入部门名称'}]}
                >
                    <Input placeholder="请输入部门名称"/>
                </Form.Item>
                <Form.Item
                    label="负责人"
                    name={['leader', 'email']}
                >
                    <Select
                        showSearch
                        style={{width: '100%'}}
                        placeholder="请选择负责人"
                        value={selectedUser}
                        onChange={(newUsers) => {
                            const selectedUserData = users.find((user) => user.nickname === newUsers);
                            if (selectedUserData) {
                                setSelectedUser(newUsers);
                                console.log('Selected User:', selectedUserData); // 输出选中的用户信息
                            }
                        }}
                    >
                        {users.map((user) => (
                            <Option key={user.id} value={user.nickname}>
                                {user.nickname}
                            </Option>
                        ))}
                    </Select>

                </Form.Item>
                <Form.Item
                    label="状态"
                    name="status"
                    initialValue={1}  // 默认状态是启用
                >
                    <Select>
                        <Option value={1}>正常</Option>
                        <Option value={0}>禁用</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddDeptModal;
