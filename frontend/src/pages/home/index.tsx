import React from 'react';
import {Layout, Typography, Button} from 'antd';
import logoImage from '../../assets/images/favicon.ico';

const {Header, Content} = Layout;
const {Title} = Typography;

const WelcomePage: React.FC = () => {
    return (
        <Layout style={{
            height: "75vh",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(240, 248, 255, 0.6))",
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Content style={{
                border: "1px solid skyblue",
                borderRadius: "10px",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                padding: '20px', // 可以根据需要调整
                flex: '1 1 auto', // 允许内容区域伸缩以填充剩余空间
                overflow: 'hidden', // 防止出现滚动条
            }}>
                <Title level={2}>欢迎使用 jxselab 用户管理系统</Title>
                <img src={logoImage} alt="logo" style={{width: '200px', height: '200px'}}/>
            </Content>
        </Layout>

    );
};

export default WelcomePage;
