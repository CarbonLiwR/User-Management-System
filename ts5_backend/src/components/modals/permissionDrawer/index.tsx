import React, { useEffect, useState } from 'react';
import { Drawer, Tree, Button, Space, Input } from 'antd';


// 将 menus 转换为适合 antd Tree 使用的数据格式
const formatMenusToTreeData = (menus) => {
    const buildTree = (list) => {
        return list.map((item) => ({
            title: item.title,
            key: item.id, // key 必须是字符串
            children: item.children ? buildTree(item.children) : [], // 如果有 children 递归处理
        }));
    };
    return buildTree(menus);
};

const PermissionDrawer = ({ visible, onCancel, onEdit, permission, allPermission}) => {
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]); // 存储选中的权限
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]); // 存储展开的节点
    const [treeData, setTreeData] = useState([]); // 存储转换后的树形菜单数据
    const [searchValue, setSearchValue] = useState(''); // 搜索值
    const [filteredTreeData, setFilteredTreeData] = useState([]);

    // 当传入的 permission (menus) 变化时更新 checkedKeys 和 treeData
    useEffect(() => {
        if (permission?.menus) {
            const tree = formatMenusToTreeData(allPermission);
            setTreeData(tree); // 设置菜单数据
            const checked = permission.menus.map((menu) => menu.id); // 初始选中状态
            setCheckedKeys(checked);
        }
    }, [permission]);

    // 处理选中的权限变化
    const onCheck = (checkedKeysValue) => {
        setCheckedKeys(checkedKeysValue);
    };

    // 提交权限更改
    const handleOk = () => {
        onEdit(checkedKeys); // 调用父组件的 onEdit 回调，保存权限
        onCancel(); // 关闭 Drawer
    };

    // 展开所有节点
    const handleExpandAll = () => {
        const allKeys = treeData.flatMap((item) => {
            const childKeys = item.children?.map((child) => child.key) || [];
            return [item.key, ...childKeys];
        });
        setExpandedKeys(allKeys);
    };

    // 收起所有节点
    const handleCollapseAll = () => {
        setExpandedKeys([]);
    };

    // 处理全选
    const handleSelectAll = () => {
        const allKeys = treeData.flatMap((item) => {
            const childKeys = item.children?.map((child) => child.key) || [];
            return [item.key, ...childKeys];
        });
        setCheckedKeys(allKeys);
    };

    // 处理取消全选
    const handleDeselectAll = () => {
        setCheckedKeys([]);
    };

    // 处理搜索过滤
    const handleSearch = (e) => {
        const { value } = e.target;
        setSearchValue(value);

        if (value) {
            const filtered = treeData
                .map((item) => {
                    const matchChildren = item.children?.filter((child) =>
                        child.title.includes(value)
                    );
                    if (item.title.includes(value) || (matchChildren && matchChildren.length > 0)) {
                        return {
                            ...item,
                            children: matchChildren || [],
                        };
                    }
                    return null;
                })
                .filter(Boolean);
            setFilteredTreeData(filtered);
        } else {
            setFilteredTreeData(treeData);
        }
    };

    return (
        <Drawer
            title="权限设置"
            width={480}
            open={visible}
            onClose={onCancel}
            footer={
                <div style={{ textAlign: 'right' }}>
                    <Space>
                        <Button onClick={onCancel}>取消</Button>
                        <Button type="primary" onClick={handleOk}>
                            确定
                        </Button>
                    </Space>
                </div>
            }
        >
            <Space style={{ marginBottom: 16 }}>
                <Button onClick={handleDeselectAll}>取消全选</Button>
                <Button onClick={handleSelectAll}>全选</Button>
                <Button onClick={expandedKeys.length ? handleCollapseAll : handleExpandAll}>
                    {expandedKeys.length ? '收起' : '展开'}
                </Button>
                <Input.Search placeholder="菜单筛选" value={searchValue} onChange={handleSearch} style={{ width: 200 }} />
            </Space>
            <Tree
                checkable
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                expandedKeys={expandedKeys}
                onExpand={setExpandedKeys}
                treeData={searchValue ? filteredTreeData : treeData}
                defaultExpandAll={false}
            />
        </Drawer>
    );
};

export default PermissionDrawer;
