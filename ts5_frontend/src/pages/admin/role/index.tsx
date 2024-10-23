import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Alert, Tag, Pagination, Divider, Modal, Form } from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDispatchRole } from '../../../hooks'; // 使用自定义 hook
import CreateRoleModal from "../../../components/modals/createRoleModal";
const { Option } = Select;

const AdminRolePage = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
    const [roleName, setRoleName] = useState('');
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [modalVisible, setModalVisible] = useState(false);

    const { getRoleList, createNewRole, removeRole } = useDispatchRole(); // 从 hook 获取函数
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);

    // 获取角色列表
    const fetchRoles = async (page = 1, pageSize = 20) => {
        setLoading(true);
        const params = {
            name: roleName,
            status,
            page,
            size: pageSize,
        };
        try {
            const response = await getRoleList(params);
            console.log(response)
            setRoles(response.payload.items);
            setPagination({ current: page, pageSize, total: response.payload.total });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // 表格的列定义
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '数据权限',
            dataIndex: 'data_scope',
            key: 'data_scope',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text: number) => (
                <Tag color={text === 1 ? 'green' : 'red'}>{text}</Tag>
            ),
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a href="#">权限设置</a>
                    <a href="#">编辑</a>
                </Space>
            ),
        },
    ];

    // 处理复选框选择
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    // 处理新建角色
    const handleCreateRole = async (values: any) => {
        try {
            await createNewRole(values);
            setModalVisible(false);
            fetchRoles(); // 刷新角色列表
        } catch (error) {
            console.error(error);
        }
    };

    const showModal = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    // 处理删除角色
    const handleDelete = async () => {
        try {
            await removeRole({ pk: selectedRowKeys as number[] });
            setSelectedRowKeys([]);
            fetchRoles();
        } catch (error) {
            console.error(error);
        }
    };

    // 分页变化时调用
    const handlePaginationChange = (page: number, pageSize: number) => {
        setPagination({ ...pagination, current: page, pageSize });
        fetchRoles(page, pageSize);
    };

    return (
        <div>
            <div style={{ textAlign: 'left', paddingBottom: '10px' }}>角色管理</div>

            {/* 搜索栏 */}
            <Space style={{ marginBottom: 16 }}>
                <Input
                    placeholder="请输入角色名称"
                    style={{ width: 200 }}
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                />
                <Select
                    placeholder="状态"
                    style={{ width: 120 }}
                    value={status}
                    onChange={(value) => setStatus(value)}
                >
                    <Option value="正常">正常</Option>
                    <Option value="禁用">禁用</Option>
                </Select>
                <Button type="primary" icon={<SearchOutlined />} onClick={() => fetchRoles()}>
                    搜索
                </Button>
                <Button icon={<DeleteOutlined />} danger onClick={() => { setRoleName(''); setStatus(undefined); fetchRoles(); }}>
                    重置
                </Button>
            </Space>
            <Divider />

            {/* 新建和删除按钮 */}
            <Space style={{ marginBottom: 16 }}>
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
                    新建
                </Button>
                <Button icon={<DeleteOutlined />} danger disabled={!selectedRowKeys.length} onClick={handleDelete}>
                    删除
                </Button>
            </Space>

            {/* 警告信息 */}
            <Alert
                message="设置数据权限为全部时，将忽略菜单授权或API授权，直接拥有所有权限，请谨慎操作！"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
            />

            {/* 表格 */}
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={roles}
                pagination={false}
                loading={loading}
            />

            {/* 分页 */}
            <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePaginationChange}
                />
            </div>

            {/* 新建角色模态框 */}
            <CreateRoleModal visible={modalVisible} onCancel={handleCancel} onCreate={handleCreateRole} />
        </div>
    );
};

export default AdminRolePage;
