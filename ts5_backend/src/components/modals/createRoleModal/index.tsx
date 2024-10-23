import { Modal, Form, Input, Select, Button, Switch } from 'antd';

const { Option } = Select;

const CreateRoleModal = ({ visible, onCancel, onCreate }) => {
    const [form] = Form.useForm();

    // 当点击确定时提交表单
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
            title="新建角色"
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
            <Form form={form} layout="vertical" name="create_role_form">
                <Form.Item
                    name="roleName"
                    label="角色名称"
                    rules={[{ required: true, message: '请输入角色名称' }]}
                >
                    <Input placeholder="请输入角色名称" />
                </Form.Item>

                <Form.Item
                    name="dataScope"
                    label="数据权限"
                    rules={[{ required: true, message: '请选择数据权限' }]}
                >
                    <Select placeholder="自定义数据权限">
                        <Option value="all">全部数据权限</Option>
                        <Option value="custom">自定义数据权限</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="status" label="状态" valuePropName="checked">
                    <Switch checkedChildren="开启" unCheckedChildren="禁用" />
                </Form.Item>

                <Form.Item name="remark" label="备注">
                    <Input.TextArea rows={4} placeholder="请输入备注" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateRoleModal;
