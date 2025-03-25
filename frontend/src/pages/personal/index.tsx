import React, {useEffect, useState} from 'react';
import {Avatar, Button, Card, Splitter, Row, Col, message} from 'antd';
import EditUserModal from "../../components/modals/editUserModal";
import {updateUser} from "../../api/user.ts";
import {useNavigate} from "react-router-dom";
import {useDispatchUser} from "../../hooks";
import EditPasswordModal from "../../components/modals/editPasswordModal";
import EditUserSettingsModal from "../../components/modals/editSystemConfigModel";
import {useDispatch} from 'react-redux';
import {updatePasswordThunk} from "../../service/userService.tsx";
import {RegisterRes, type ResetPasswordData} from "../../api/auth.tsx";
import CryptoJS from 'crypto-js'; // 引入 CryptoJS 库 加密模块
import avatar from '../../assets/images/jxnu.png';

const Personal: React.FC = () => {
    const {fetchUser} = useDispatchUser();
    const [currentUser, setCurrentUser] = useState<any>(null);

    //用户配置管理
    const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
    const [isEditPasswordModalVisible, setIsEditPasswordModalVisible] = useState(false);
    const [isEditSystemConfigModelVisible, setIsEditSystemConfigModelVisible] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const loadUser = async () => { // 将 loadUser 提取到外部
        const user = await fetchUser();
        localStorage.setItem("user", JSON.stringify(user.payload));
        // console.log("user",user.payload);
        setCurrentUser(user.payload);
    };

    const showEditUserModal = () => {
        setIsEditUserModalVisible(true);
    };

    const handleEditUser = async (userData: any) => {
        await updateUser(currentUser.username, userData);
        await loadUser(); // 确保这里也是异步调用
        setIsEditUserModalVisible(false);
        message.success("用户信息更新成功")
    };

    const handleCancelEditUser = () => {
        setIsEditUserModalVisible(false);
    };

    const showEditPasswordModal = () => {
        setIsEditPasswordModalVisible(true);
    }

    function encryptData(data: any, secretKey: any) {
        const iv = CryptoJS.lib.WordArray.random(16);  // 随机生成 16 字节的 IV
        const encrypted = CryptoJS.AES.encrypt(data, secretKey, {iv: iv});  // 使用 AES CBC 模式加密数据
        // 返回 IV 和密文（Base64 编码）
        return {
            iv: iv.toString(CryptoJS.enc.Base64),
            ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64)
        };
    }

    const handleEditPassword = async (values: ResetPasswordData) => {
        const secretKeyBase64 = "G8ZyYyZ0Xf5x5f6uZrwf6ft4gD0pniYAkHp/Y6f4Pv4=";  // Base64 编码的密钥
        const secretKey = CryptoJS.enc.Base64.parse(secretKeyBase64);  // 解码为字节数组
        // 对数据进行加密
        const encryptedUsername = encryptData(values.username, secretKey);
        const encryptedUEmail = encryptData(values.email, secretKey);
        const encryptedPassword = encryptData(values.password, secretKey);
        const encryptedCaptcha = encryptData(values.captcha, secretKey);
        const encryptedResetData = {
            username: encryptedUsername.ciphertext,
            username_iv: encryptedUsername.iv,
            email: encryptedUEmail.ciphertext,
            email_iv: encryptedUEmail.iv,
            password: encryptedPassword.ciphertext,
            password_iv: encryptedPassword.iv,
            captcha: encryptedCaptcha.ciphertext,
            captcha_iv: encryptedCaptcha.iv,
        };
        const resultAction = await dispatch(updatePasswordThunk(encryptedResetData)) as {
            payload: RegisterRes,
            error?: any
        };
        if (updatePasswordThunk.fulfilled.match(resultAction)) {
            const {data} = resultAction.payload; // 确保从 payload 中提取 msg
            message.success(data || "密码修改成功，请重新登录", 3);
            navigate('/login'); // 添加这一行以使用 navigate
        }
        setIsEditPasswordModalVisible(false);
    }

    const handleCancelEditPassword = () => {
        setIsEditPasswordModalVisible(false);
    }
    //用户配置方法
    const showEditSystemConfigModel = () => {
        setIsEditSystemConfigModelVisible(true);
    }
    //

    const handleEditSystemConfig = async (userData: any) => {
        await updateUser(currentUser.username, userData);
        await loadUser(); // 确保这里也是异步调用
        message.success("个人配置修改成功！");
        setIsEditSystemConfigModelVisible(false);
    };

    const handleCancelEditSystemConfig = () => {
        setIsEditSystemConfigModelVisible(false);
    }

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

    useEffect(() => {
        loadUser(); // 调用异步函数
    }, []);

    return (
        <div>
            <EditUserModal
                changeUsername={false}
                visible={isEditUserModalVisible}
                onCancel={handleCancelEditUser}
                onCreate={handleEditUser}
                user={currentUser}
            />

            <EditPasswordModal
                visible={isEditPasswordModalVisible}
                onCancel={handleCancelEditPassword}
                onCreate={handleEditPassword}
                user={currentUser}
            />


            <Splitter style={{height: "80vh", boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
                <Splitter.Panel defaultSize="25%" min="10%" max="30%" style={{textAlign: 'center'}}>
                    <Card title="用户信息">
                        <Avatar size={100} src={avatar} alt="用户头像"/>
                        <div style={{margin: '20px 0', height: '20vh'}}>
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
                            <Button
                                style={{position: "relative"}}
                                onClick={showEditUserModal}
                            >
                                修改信息
                            </Button>
                            <Button
                                style={{position: "relative"}}
                                onClick={showEditPasswordModal}
                            >
                                修改密码
                            </Button>

                        </div>
                    </Card>

                </Splitter.Panel>
                <Splitter.Panel style={{overflowY: 'hidden', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
                    <Card title="模型服务配置">
                        <EditUserSettingsModal
                        />
                    </Card>
                </Splitter.Panel>
            </Splitter>
        </div>
    );
};

export default Personal;
