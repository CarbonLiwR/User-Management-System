import React, {useState, useEffect} from 'react';
import {Table, Button, Input, Select, Space, Alert, Tag, Pagination, Divider, message} from 'antd';
import {SearchOutlined, PlusOutlined, DeleteOutlined} from '@ant-design/icons';
import {useDispatchRole, useDispatchMenu} from '../../../hooks'; // 使用自定义 hook
import CreateRoleModal from "../../../components/modals/createRoleModal";
import EditRoleModal from "../../../components/modals/editRoleModal";
import PermissionDrawer from "../../../components/modals/permissionDrawer";  // 引入权限设置抽屉


const {Option} = Select;

const AdminRolePage = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState({current: 1, pageSize: 20, total: 0});
    const [roleName, setRoleName] = useState('');
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false); // 编辑模态框的可见性
    const [drawerVisible, setDrawerVisible] = useState(false); // 控制权限设置的 drawer
    const [currentRole, setCurrentRole] = useState(null);
    const [permissions, setPermissions] = useState([]); // 存储所有权限


    const {getRoleList, createNewRole, updateRoleInfo, removeRole, updateRoleMenus} = useDispatchRole(); // 从 hook 获取函数
    const {getMenuTree} = useDispatchMenu();  // 从menuHook获取权限菜单
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);

    // 获取角色列表及所有权限数据
    const fetchRoles = async (page = 1, pageSize = 20) => {
        setLoading(true);
        const params = {
            name: roleName,
            status,
            page,
            size: pageSize,
        };
        try {
            const [roleResponse, menuResponse] = await Promise.all([
                getRoleList(params),     // 获取角色列表
                getMenuTree(),           // 获取所有权限菜单
            ]);
            setRoles(roleResponse.payload.items);
            setPagination({current: page, pageSize, total: roleResponse.payload.total});
            setPermissions(menuResponse.payload);  // 存储所有权限菜单
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();  // 初次加载时获取角色列表及权限数据
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
            render: (text: number) => (
                <Tag color={'blue'}>{text === 1 ? '全部数据权限' : '自定义数据权限'}</Tag>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text: number) => (
                <Tag color={text === 1 ? 'green' : 'red'}>{text === 1 ? '正常' : '禁用'}</Tag>
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
                    <a href="#" onClick={() => showEditModal(record)}>编辑</a> {/* 编辑角色 */}
                    <a href="#" onClick={() => showPermissionDrawer(record)}>权限设置</a> {/* 权限设置 */}
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
        const response = await createNewRole(values);
        setModalVisible(false); // 关闭模态框

        // 检查是否返回了拒绝状态
        if (response.type === 'role/createRole/rejected') {
            // 如果返回的是拒绝状态，手动处理错误
            message.error('角色创建失败');
            return; // 退出函数
        }
        message.success('角色创建成功');

        fetchRoles(); // 刷新角色列表
    };


    // 显示新建模态框
    const showModal = () => {
        setModalVisible(true);
    };

    // 关闭新建模态框
    const handleCancel = () => {
        setModalVisible(false);
    };

    // 显示编辑模态框
    const showEditModal = (record: any) => {
        setCurrentRole(record); // 设置当前编辑的角色
        setEditModalVisible(true); // 打开编辑模态框
    };

    // 关闭编辑模态框
    const handleEditCancel = () => {
        setEditModalVisible(false);
    };

    // 处理编辑角色的更新
    const handleEditRole = async (values: any) => {
        const response = await updateRoleInfo(currentRole.id, values);

        setEditModalVisible(false); // 关闭模态框

        // 检查是否返回了拒绝状态
        if (response.type === 'role/updateRole/rejected') {
            // 如果返回的是拒绝状态，手动处理错误
            message.error('角色更新失败');
            return; // 退出函数
        }
        message.success('角色更新成功');
        fetchRoles(); // 刷新角色列表
    };


    const handleEditPermission = async (values: number[]) => {
        const response = await updateRoleMenus(currentRole.id, {menus: values});
        console.log(response);
        setEditModalVisible(false); // 关闭模态框

        // 检查是否返回了拒绝状态
        if (response.type === 'role/updateRoleMenu/rejected') {
            // 如果返回的是拒绝状态，手动处理错误
            message.error('权限更新失败');
            return; // 退出函数
        }
        message.success('权限更新成功');
        fetchRoles(); // 刷新角色列表
    };


    // 显示权限设置 Drawer
    const showPermissionDrawer = async (record) => {
        setCurrentRole(record);
        await fetchRoles(); // 确保角色数据加载完毕
        setDrawerVisible(true); // 打开 Drawer
    };

    // 关闭权限设置 Drawer
    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    // 处理删除角色
    const handleDelete = async () => {
        const response = await removeRole({pk: selectedRowKeys as number[]});
        setSelectedRowKeys([]); // 清空选中的行

        // 检查是否返回了拒绝状态
        if (response.type === 'role/deleteRole/rejected') {
            // 如果返回的是拒绝状态，手动处理错误
            message.error('角色删除失败');
            return; // 退出函数
        }
        message.success('角色删除成功');
        fetchRoles(); // 刷新角色列表
    };


    // 分页变化时调用
    const handlePaginationChange = (page: number, pageSize: number) => {
        setPagination({...pagination, current: page, pageSize});
        fetchRoles(page, pageSize);
    };

    return (
        <div>
            <h2>角色管理</h2>

            {/* 搜索栏 */}
            <Space style={{marginBottom: 16}}>
                <Input
                    placeholder="请输入角色名称"
                    style={{width: 200}}
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                />
                <Select
                    placeholder="状态"
                    style={{width: 120}}
                    value={status}
                    onChange={(value) => setStatus(value)}
                >
                    <Option value="正常">正常</Option>
                    <Option value="禁用">禁用</Option>
                </Select>
                <Button type="primary" icon={<SearchOutlined/>} onClick={() => fetchRoles()}>
                    搜索
                </Button>
                <Button onClick={() => {
                    setRoleName('');
                    setStatus(undefined);
                    fetchRoles();
                }}>
                    重置
                </Button>
            </Space>
            <Divider/>

            {/* 新建和删除按钮 */}
            <Space style={{marginBottom: 16}}>
                <Button type="primary" icon={<PlusOutlined/>} onClick={showModal}>
                    新建
                </Button>
                <Button icon={<DeleteOutlined/>} danger disabled={!selectedRowKeys.length} onClick={handleDelete}>
                    删除
                </Button>
            </Space>

            {/* 警告信息 */}
            <Alert
                message="设置数据权限为全部时，将忽略菜单授权或API授权，直接拥有所有权限，请谨慎操作！"
                type="warning"
                showIcon
                style={{marginBottom: 16}}
            />

            {/* 表格 */}
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={roles}
                rowKey="id"
                pagination={false}
                loading={loading}
            />

            {/* 分页 */}
            <div style={{marginTop: 16, textAlign: 'right'}}>
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={handlePaginationChange}
                />
            </div>

            {/* 新建角色模态框 */}
            <CreateRoleModal visible={modalVisible} onCancel={handleCancel} onCreate={handleCreateRole}/>

            {/* 编辑角色模态框 */}
            <EditRoleModal
                visible={editModalVisible}
                onCancel={handleEditCancel}
                onEdit={handleEditRole}
                role={currentRole}
            />

            {/* 权限设置 Drawer */}
            <PermissionDrawer
                visible={drawerVisible}
                onCancel={closeDrawer}
                onEdit={handleEditPermission}
                permission={currentRole}
                allPermission={permissions}
            />
        </div>
    );
};

export default AdminRolePage;
