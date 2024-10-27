import React, {useEffect, useState} from 'react';
import {Avatar, Button, Card, Splitter, Row, Col} from 'antd';
import EditUserModal from "../../components/modals/editUserModal";
import {updateUser} from "../../api/user.ts";
import {useNavigate} from "react-router-dom";
import {useDispatchUser} from "../../hooks";

const Personal: React.FC = () => {
    const { fetchUser } = useDispatchUser();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
    const navigate = useNavigate();

    const loadUser = async () => { // 将 loadUser 提取到外部
        const user = await fetchUser();
        setCurrentUser(user.payload);
    };

    useEffect(() => {
        loadUser(); // 调用异步函数
    }, []);

    const showEditUserModal = () => {
        setIsEditUserModalVisible(true);
    };

    const handleEditUser = async (userData: any) => {
        await updateUser(currentUser.username, userData);
        await loadUser(); // 确保这里也是异步调用
        setIsEditUserModalVisible(false);
    };

    const handleCancelEditUser = () => {
        setIsEditUserModalVisible(false);
    };

    const data = currentUser ? [
        {
            key: '1',
            label: '昵称',
            content: currentUser.nickname,
        },
        {
            key: '2',
            label: '用户名',
            content: currentUser.username,
        },
        {
            key: '3',
            label: '邮箱',
            content: currentUser.email,
        },
    ] : [];

    return (
        <div>
            <EditUserModal
                visible={isEditUserModalVisible}
                onCancel={handleCancelEditUser}
                onCreate={handleEditUser}
                user={currentUser}
            />

            <Splitter style={{height: "80vh", boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
                <Splitter.Panel defaultSize="35%" min="20%" max="50%" style={{textAlign: 'center'}}>
                    <Card title="用户信息">
                        <Avatar size={100} src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                alt="用户头像"/>
                        <div style={{margin: '20px 0'}}>
                            {data.map(item => (
                                <Row key={item.key} style={{marginBottom: 8}}>
                                    <Col span={8} style={{textAlign: 'right', paddingRight: 10}}>
                                        <strong>{item.label}:</strong>
                                    </Col>
                                    <Col span={16} style={{textAlign: 'left'}}>
                                        {item.content}
                                    </Col>
                                </Row>
                            ))}
                        </div>
                    </Card>
                    <Button
                        style={{position: "relative", bottom: "-30vh"}}
                        onClick={showEditUserModal}
                    >
                        修改信息
                    </Button>
                    <Button
                        style={{position: "relative", bottom: "-30vh"}}
                        onClick={() => navigate('/forget')}
                    >
                        修改密码
                    </Button>
                </Splitter.Panel>
                <Splitter.Panel>
                    <Card title="个人信息">
                        {/* 在这里添加个人信息内容 */}
                    </Card>
                </Splitter.Panel>
            </Splitter>
        </div>
    );
};

export default Personal;
