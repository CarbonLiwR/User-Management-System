import React from 'react';
import {Layout, Input, Avatar, Tooltip,Dropdown,  Space} from 'antd';
import {SearchOutlined, SettingOutlined, BellOutlined, UserOutlined, ToolOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd'
import {useDispatchUser} from "../../hooks/user";


const {Header} = Layout;

const CustomHeader = () => {
    const { logoutUser } = useDispatchUser();

    const onClick: MenuProps['onClick'] = ({ key }) => {
        if (key === '1') {
            logoutUser(); // 调用 logoutUser 函数
        }
    };

    const items: MenuProps['items'] = [
        {
            label: '退出登录',
            key: '1',
        },
    ];

    return (
        <Header style={{
            background: '#fff',
            marginLeft: "5px",
            padding: '2px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>

            {/* 左侧：Logo 和系统名称 */}
            <div style={{display: 'flex', alignItems: 'center'}}>
                {/*<img*/}
                {/*    src="https://arco.design/logo.svg" // 示例 Logo 地址，替换为你的 logo 地址*/}
                {/*    alt="Logo"*/}
                {/*    style={{ width: 40, height: 40, marginRight: 16 }}*/}
                {/*/>*/}
                <h2 style={{margin: 0}}>技术寻人系统</h2>
            </div>

            {/* 右侧：搜索框、快捷按钮 */}
            <Space size="middle">
                {/* 搜索框 */}
                <Input
                    placeholder="搜索..."
                    prefix={<SearchOutlined/>}
                    style={{width: 200}}
                />

                {/* 快捷按钮 */}
                <Tooltip title="工具">
                    <ToolOutlined style={{fontSize: 20}}/>
                </Tooltip>

                <Tooltip title="通知">
                    <BellOutlined style={{fontSize: 20}}/>
                </Tooltip>

                <Tooltip title="全屏">
                    <UserOutlined style={{fontSize: 20}}/>
                </Tooltip>

                <Tooltip title="设置">
                    <SettingOutlined style={{fontSize: 20}}/>
                </Tooltip>

                {/* 头像 */}
                <Dropdown menu={{items, onClick, style:{ marginTop: '10px' ,right:'-15px'}} }>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <Avatar
                                src="https://www.example.com/user-avatar.png" // 替换为用户头像地址
                                alt="用户头像"
                                size="default"
                                style={{cursor: 'pointer',marginBottom: '8px'}}
                            />
                        </Space>
                    </a>
                </Dropdown>
            </Space>
        </Header>
    );
};

export default CustomHeader;
