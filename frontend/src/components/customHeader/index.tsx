import {Layout, Input, Avatar,Dropdown,  Space} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd'
import {useDispatchUser} from "../../hooks";


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
                <h2 style={{margin: 0}}>用户管理系统</h2>
            </div>

            {/* 右侧：搜索框、快捷按钮 */}
            <Space size="middle">
                {/* 搜索框 */}
                <Input
                    placeholder="搜索..."
                    prefix={<SearchOutlined/>}
                    style={{width: 200}}
                />



                {/* 头像 */}
                <Dropdown menu={{items, onClick, style:{ marginTop: '10px' ,right:'-15px'}} }>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <Avatar
                                src="https://sapper3701-1316534880.cos.ap-nanjing.myqcloud.com/44330c73-c348-4cb8-b740-f5d1d32af983/f4944bc0-1008-4ad7-8fe8-6a96ca57a12a.png" // 替换为用户头像地址
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
