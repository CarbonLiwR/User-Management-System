import React, {useCallback, useEffect, useState} from 'react';
import {Modal, Form, Input, Button, Row, Image, message} from 'antd';
import {CheckCircleOutlined, EyeInvisibleOutlined, EyeOutlined, LockOutlined} from "@ant-design/icons";
import {useDispatch} from 'react-redux';
import {getCaptcha, RegisterRes} from '../../../api/auth';
import {Rule} from "antd/es/form";
import CryptoJS from 'crypto-js'; // 引入 CryptoJS 库 加密模块


const IPT_RULE_PASSWORD: Rule[] = [
    {required: true, message: "请输入密码"},
    {min: 8, message: "密码至少为 8 位"},
    {
        pattern: /(?=.*[a-z])(?=.*\d)/,
        message: "密码必须包含至少一个小写字母和一个数字",
    },
    {
        max: 20,
        message: "密码不能超过 20 位",
    },
];
const IPT_RULE_CAPTCHA = [{required: true, message: "请输入验证码"}];

const EditUserModal = ({visible, onCancel, onCreate, user}) => {
    const [form] = Form.useForm();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // 添加确认密码可见性状态
    const [captchaSrc, setCaptchaSrc] = useState("");
    // console.log(user);
    const refreshCaptcha = useCallback(async () => {
        try {
            const captcha = await getCaptcha();
            setCaptchaSrc(`data:image/png;base64, ${captcha.image}`);
        } catch (err) {
            message.error("验证码获取失败");
        }
    }, []);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    function encryptData(data:any, secretKey:any) {
        const iv = CryptoJS.lib.WordArray.random(16);  // 随机生成 16 字节的 IV
        const encrypted = CryptoJS.AES.encrypt(data, secretKey, { iv: iv });  // 使用 AES CBC 模式加密数据
        // 返回 IV 和密文（Base64 编码）
        return {
            iv: iv.toString(CryptoJS.enc.Base64),
            ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64)
        };
    }

    const validateConfirmPassword = (_: { required?: boolean }, value: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const password = form.getFieldValue('password');
            if (value && value !== password) {
                reject("两次输入的密码不一致");
            } else {
                resolve();
            }
        });
    };


    useEffect(() => {
        if (visible) {
            refreshCaptcha(); // 打开模态框时请求验证码
        }
    }, [visible, refreshCaptcha]);


    const handleOk = () => {
    form
        .validateFields()
        .then((values) => {
            const { confirm, ...rest } = values; // 移除 confirm 字段
            const submitValues = {
                ...rest,
                username: user?.username, // 添加 username
                email: user?.email, // 添加 email
            };

            // 加密数据
            const secretKeyBase64 = "G8ZyYyZ0Xf5x5f6uZrwf6ft4gD0pniYAkHp/Y6f4Pv4=";  // Base64 编码的密钥
            const secretKey = CryptoJS.enc.Base64.parse(secretKeyBase64);  // 解码为字节数组

            const encryptedUsername = encryptData(submitValues.username, secretKey);
            const encryptedEmail = encryptData(submitValues.email, secretKey);
            const encryptedPassword = encryptData(submitValues.password, secretKey);
            const encryptedCaptcha = encryptData(submitValues.captcha, secretKey);

            const encryptedResetData = {
                username: encryptedUsername.ciphertext,
                username_iv: encryptedUsername.iv,
                email: encryptedEmail.ciphertext,
                email_iv: encryptedEmail.iv,
                password: encryptedPassword.ciphertext,
                password_iv: encryptedPassword.iv,
                captcha: encryptedCaptcha.ciphertext,
                captcha_iv: encryptedCaptcha.iv,
            };

            // 调用父组件的创建方法，传递加密后的数据
            onCreate(encryptedResetData);

            // 提交后重置表单
            form.resetFields();
        })
        .catch((info) => {
            console.log('Validate Failed:', info);
        });
};


    return (
        <Modal
            title="更改密码"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    确定
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                name="add_user_form"
                initialValues={{
                    department: [],
                    role: [],
                }}
            >
                <Form.Item name="password" rules={IPT_RULE_PASSWORD}>
                    <Input
                        type={passwordVisible ? "text" : "password"}
                        autoComplete="off"
                        prefix={<LockOutlined/>}
                        placeholder="密码"
                        suffix={
                            passwordVisible ?
                                <EyeOutlined
                                    onClick={togglePasswordVisibility}
                                    style={{cursor: 'pointer', color: 'inherit'}}
                                /> :
                                <EyeInvisibleOutlined
                                    onClick={togglePasswordVisibility}
                                    style={{cursor: 'pointer', color: 'inherit'}}
                                />
                        }
                    />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    rules={[
                        {required: true, message: "请确认密码"},
                        {validator: validateConfirmPassword}
                    ]}
                >
                    <Input
                        type={confirmPasswordVisible ? "text" : "password"}
                        autoComplete="off"
                        placeholder="确认密码"
                        prefix={<LockOutlined/>}
                        suffix={
                            confirmPasswordVisible ?
                                <EyeOutlined
                                    onClick={toggleConfirmPasswordVisibility}
                                    style={{cursor: 'pointer', color: 'inherit'}}
                                /> :
                                <EyeInvisibleOutlined
                                    onClick={toggleConfirmPasswordVisibility}
                                    style={{cursor: 'pointer', color: 'inherit'}}
                                />
                        }
                    />
                </Form.Item>

                <Form.Item name="captcha" rules={IPT_RULE_CAPTCHA}>
                    <Row align="middle">
                        <Input prefix={<CheckCircleOutlined/>} placeholder="请输入验证码"
                               style={{width: '60%', flex: 1}}/>
                        <Image
                            src={captchaSrc}
                            preview={false}
                            alt="captcha"
                            onClick={refreshCaptcha}
                            style={{cursor: "pointer", height: "32px", width: "auto"}}
                        />
                    </Row>
                </Form.Item>

            </Form>
        </Modal>
    );
};

export default EditUserModal;
