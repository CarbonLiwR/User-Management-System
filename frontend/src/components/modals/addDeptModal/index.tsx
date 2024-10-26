import React, {useEffect, useState} from 'react';
import {Modal, Form, Input, Select} from 'antd';

const {Option} = Select;

const AddDeptModal = ({visible, onCancel, onCreate,allUsers = [],users = [],onEdit}) => {
    const [form] = Form.useForm();
    const [selectedUsers, setSelectedUsers] = useState(users.map((user) => user.name));
    console.log(allUsers);
    console.log(users);
    useEffect(() => {
        setSelectedUsers(users.map((user) => user.name));
        console.log(users);
    }, []);

    // 提交表单数据
    // const handleSubmit = () => {
    //     form
    //         .validateFields()
    //         .then((values) => {
    //             onCreate(values);
    //             form.resetFields(); // 重置表单
    //         })
    //         .catch((info) => {
    //             console.log('Validate Failed:', info);
    //         });
    // };
     const handleSubmit = () => {
        const selectedUser = allUsers
            .filter((user) => selectedUsers.includes(user.name))  // 根据名称筛选
        // .map((role) => role.id);  // 只获取 id
        onEdit(selectedUser);
    };

    return (
        <Modal
            title="新增部门"
            visible={visible}
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
                    name="leader"
                >
                    <Select
                        mode="multiple"
                        style={{width: '100%'}}
                        placeholder="请选择负责人"
                        value={selectedUsers}
                        onChange={(newUsers) => setSelectedUsers(newUsers)}
                    >
                        {allUsers.map((user) => (
                            <Option key={user.id} value={user.name}>
                                {user.name}
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
