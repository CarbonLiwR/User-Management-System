import React, {useEffect, useState} from 'react';
import {Drawer, Tree, Button, Space, Input} from 'antd';

// 将 menus 转换为适合 antd Tree 使用的数据格式并生成 parentMap
const formatMenusToTreeData = (menus) => {
    const parentMap = new Map();

    const buildTree = (list, parent = null) => {
        return list.map((item) => {
            if (parent !== null) {
                parentMap.set(item.id, parent);
            }
            return {
                title: item.title,
                key: item.id,
                children: item.children ? buildTree(item.children, item.id) : [],
            };
        });
    };

    return {
        treeData: buildTree(menus),
        parentMap,
    };
};

const PermissionDrawer = ({visible, onCancel, onEdit, permission, allPermission}) => {
    const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [treeData, setTreeData] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [filteredTreeData, setFilteredTreeData] = useState([]);
    const [parentMap, setParentMap] = useState(new Map());


    useEffect(() => {
        if (permission?.menus) {
            const {treeData, parentMap} = formatMenusToTreeData(allPermission);
            setTreeData(treeData);
            setParentMap(parentMap);

            const leafChecked = permission.menus.map(menu => menu.id);
            const q = removeParentKeys(leafChecked);

            setCheckedKeys(q); // 初始设置前先调用
        }
    }, [permission, allPermission]); // 添加依赖项


    // 处理选中的权限变化
    const onCheck = (checkedKeysValue) => {
        setCheckedKeys(removeParentKeys(checkedKeysValue)); // 每次更新前调用
    };


    const addParentKeys = (keys) => {
        const newCheckedKeys = new Set(keys); // 使用 Set 防止重复
        keys.forEach((key) => {
            let parent = parentMap.get(key);
            // 逐层添加父节点
            while (parent !== undefined && !newCheckedKeys.has(parent)) {
                newCheckedKeys.add(parent);
                parent = parentMap.get(parent);
            }
        });
        return [...newCheckedKeys]; // 返回包含父节点的最终列表
    };


    const removeParentKeys = (keys) => {
        const keysSet = new Set(keys);
        const keysToRemove = new Set();

        keys.forEach(key => {
            let parent = parentMap.get(key);
            while (parent) {
                if (keysSet.has(parent)) {
                    keysToRemove.add(parent);
                }
                parent = parentMap.get(parent);
            }
        });

        return keys.filter(key => !keysToRemove.has(key));
    };

    const handleOk = () => {
        const filteredKeys = addParentKeys(checkedKeys);
        console.log(filteredKeys);
        onEdit(filteredKeys);
        onCancel();
    };

    const handleSearch = (e) => {
        const {value} = e.target;
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

    const handleSelectAll = () => {
        const allLeafKeys = [];

        const findAllLeafNodes = (data) => {
            data.forEach((item) => {
                // 如果当前节点没有子节点，则将其添加到选中的键中
                if (!item.children || item.children.length === 0) {
                    allLeafKeys.push(item.key);
                } else {
                    // 递归查找子节点
                    findAllLeafNodes(item.children);
                }
            });
        };

        findAllLeafNodes(treeData);
        setCheckedKeys(allLeafKeys); // 更新选中的权限
    };


    return (
        <Drawer
            title="权限设置"
            width={480}
            open={visible}
            onClose={onCancel}
            footer={
                <div style={{textAlign: 'right'}}>
                    <Space>
                        <Button onClick={onCancel}>取消</Button>
                        <Button type="primary" onClick={handleOk}>确定</Button>
                    </Space>
                </div>
            }
        >
            <Space style={{marginBottom: 16}}>
                <Button onClick={() => setCheckedKeys([])}>取消全选</Button>
                <Button onClick={() => handleSelectAll()}>全选</Button>
                <Input.Search placeholder="菜单筛选" value={searchValue} onChange={handleSearch} style={{width: 200}}/>
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
