import React, {useState, useEffect} from 'react';
import {Table, Button, Input, Select, Space, Tag, Divider, message} from 'antd';
import {SearchOutlined, PlusOutlined} from '@ant-design/icons';
import AddDeptModal from "../../../components/modals/addDeptModal";
import {useDispatchDept, useDispatchUser} from '../../../hooks';

import EditDeptModal from "../../../components/modals/editDeptModal";  // 假设你已经有 useDispatchDept

const {Option} = Select;

const AdminDeptPage = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [pagination, setPagination] = useState({current: 1, pageSize: 20, total: 0});
    const [loading, setLoading] = useState(false);
    const [depts, setDepts] = useState([]); // 存储部门数据
    const [users, setUsers] = useState([]); // 存储用户数据
    const [currentuser, setCurrentUser] = useState(null);
    const [searchParams, setSearchParams] = useState({
        name: '',
        leader: '',
        // phone: '',
        status: undefined,
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const {fetchUsers} = useDispatchUser();
    const {fetchAllDepartments, addDepartment, removeDepartment, updateDepartment} = useDispatchDept();
    const [editDeptModalVisible, setEditDeptModalVisible] = useState(false); // 编辑模态框的可见性
    const [currentDept, setCurrentDept] = useState(null);

    useEffect(() => {
        loadDepts(); // 初次加载部门数据
    }, [pagination.current, pagination.pageSize]);

    const loadDepts = async () => {
        setLoading(true);
        const params = {
            ...searchParams,
            page: pagination.current,
            size: pagination.pageSize,
        };

        try {
            const [userResponse, deptResponse] = await Promise.all([
                fetchUsers(params),
                fetchAllDepartments(params),
            ]);

            if (userResponse.payload) {
                setPagination((prev) => ({...prev, total: userResponse.payload.total})); // 更新分页
                // 你可以在这里设置用户数据，如果需要的话
                setUsers(userResponse.payload.items); // 假设你有一个状态来存储用户
            }

            if (deptResponse.payload) {
                setDepts(deptResponse.payload); // 设置部门数据
            }
        } catch (error) {
            console.error('Failed to load users and departments:', error);
        } finally {
            setLoading(false);
        }
    };


    // 处理搜索
    const onSearch = () => {
        setPagination({...pagination, current: 1}); // 搜索时回到第一页
        loadDepts(); // 根据过滤条件重新加载数据
    };

    // 处理重置
    const handleReset = () => {
        setSearchParams({
            name: '',
            leader: '',
            phone: '',
            status: undefined,
        });
        setPagination({...pagination, current: 1});
        loadDepts(); // 重置搜索条件并重新加载数据
    };

    // 打开模态框
    const showModal = () => {
        setIsModalVisible(true);
    };

    // 关闭模态框
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDeleteDept = async (pk: number) => {
        const response = await removeDepartment(pk);

        if (response.type === 'dept/deleteDept/rejected') {
            // 如果返回的是拒绝状态，手动处理错误
            message.error('部门删除失败');
            return; // 退出函数
        }

        // 如果成功，继续执行
        message.success('部门删除成功');
        await loadDepts();
    };


    // 提交新部门数据
    const handleAddDept = async (values: any) => {
        const response = await addDepartment(values);
        setIsModalVisible(false); // 关闭模态框

        if (response.type === 'dept/createDept/rejected') {
            // 如果返回的是拒绝状态，手动处理错误
            message.error('部门创建失败');
            return; // 退出函数
        }
        await loadDepts(); // 刷新部门列表
        message.success('部门创建成功');

    };

    const handleEditCancel = () => {
        setEditDeptModalVisible(false);
    };

    const showDeptEditModal = (record: any) => {
        setCurrentDept(record); // 设置当前编辑的角色
        setEditDeptModalVisible(true); // 打开编辑模态框
    };

    const handleEditDept = async (values: any) => {
        const response = await updateDepartment(currentDept.id, values);
        console.log(response);

        if (response.type === 'dept/updateDept/rejected') {
            // 如果返回的是拒绝状态，手动处理错误
            message.error('部门编辑失败');
            return; // 退出函数
        }

        // 如果成功，继续执行
        setEditDeptModalVisible(false);
        await loadDepts();
    };


    const columns = [
        {
            title: '部门名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '负责人',
            dataIndex: 'leader',
            key: 'leader',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: number) => (
                <Tag color={status === 1 ? 'green' : 'red'}>{status === 1 ? '正常' : '禁用'}</Tag>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a href="#" onClick={() => showDeptEditModal(record)}>编辑</a>
                    <a href="#" onClick={() => handleDeleteDept(record.id)}>删除</a>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h2>部门管理</h2>

            {/* 搜索栏 */}
            <Space style={{marginBottom: 16}}>
                <Input
                    placeholder="请输入部门名称"
                    style={{width: 200}}
                    value={searchParams.name}
                    onChange={(e) => setSearchParams({...searchParams, name: e.target.value})}
                />
                <Input
                    placeholder="请输入负责人"
                    style={{width: 200}}
                    value={searchParams.leader}
                    onChange={(e) => setSearchParams({...searchParams, leader: e.target.value})}
                />
                <Select
                    placeholder="状态"
                    style={{width: 120}}
                    value={searchParams.status}
                    onChange={(value) => setSearchParams({...searchParams, status: value})}
                >
                    <Option value={undefined}>全部</Option>
                    <Option value={1}>正常</Option>
                    <Option value={0}>禁用</Option>
                </Select>
                <Button type="primary" icon={<SearchOutlined/>} onClick={onSearch}>
                    搜索
                </Button>
                <Button onClick={handleReset}>重置</Button>
            </Space>
            <Divider/>

            {/* 添加部门按钮 */}
            <Button type="primary" icon={<PlusOutlined/>} style={{marginBottom: 16}} onClick={showModal}>
                新增
            </Button>

            {/* 部门表格 */}
            <Table
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                columns={columns}
                dataSource={depts}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={(pagination) => setPagination(pagination)}
            />

            {/* 新增部门的模态框 */}
            <AddDeptModal
                visible={isModalVisible}
                users={users}
                onCancel={handleCancel}
                onCreate={handleAddDept}
            />

            <EditDeptModal
                users={users}
                visible={editDeptModalVisible}
                onCancel={handleEditCancel}
                onEdit={handleEditDept}
                dept={currentDept}
            />
        </div>
    );
};

export default AdminDeptPage;
