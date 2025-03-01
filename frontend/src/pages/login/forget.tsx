import {useCallback, useState, useEffect, useRef} from "react";
import {Form, Input, Button, message, Row, Image} from "antd";
import {Rule} from 'antd/es/form'; // 引入 Rule 类型
import {Link, useNavigate} from "react-router-dom";
import {getCaptcha, RegisterRes} from '../../api/auth';
import {useDispatch} from 'react-redux';
import {updatePasswordThunk} from "../../service/userService.tsx";
import './index.css';
import CryptoJS from 'crypto-js'; // 引入 CryptoJS 库 加密模块
import {
    EyeInvisibleOutlined,
    EyeOutlined,
    UserOutlined,
    MailOutlined,
    CheckCircleOutlined,
    LockOutlined
} from '@ant-design/icons';
import type {ResetPasswordData} from '../../api/auth';

const IPT_RULE_USERNAME: Rule[] = [{required: true, message: "请输入账号"}];
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
const IPT_RULE_EMAIL: Rule[] = [
    {required: true, message: "请输入有效的电子邮箱"},
    {type: 'email', message: "请输入有效的邮箱格式"},
];
const IPT_RULE_CAPTCHA = [{required: true, message: "请输入验证码"}];

function ForgetPwdPage() {
    const [form] = Form.useForm();
    const [captchaSrc, setCaptchaSrc] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hasFetchedCaptcha = useRef(false); // 使用 useRef 控制请求次数

    const refreshCaptcha = useCallback(async () => {
        try {
            const captcha = await getCaptcha();
            setCaptchaSrc(`data:image/png;base64, ${captcha.image}`);
        } catch (err) {
            message.error("验证码获取失败");
        }
    }, []);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // 添加确认密码可见性状态

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    useEffect(() => {
        if (!hasFetchedCaptcha.current) {
            refreshCaptcha();
            hasFetchedCaptcha.current = true; // 仅请求一次
        }
    }, [refreshCaptcha]);

    // AES 加密函数
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


    const onFinish = useCallback(async (values: ResetPasswordData) => {
        const secretKeyBase64 = "G8ZyYyZ0Xf5x5f6uZrwf6ft4gD0pniYAkHp/Y6f4Pv4=";  // Base64 编码的密钥
        const secretKey = CryptoJS.enc.Base64.parse(secretKeyBase64);  // 解码为字节数组
        // 对数据进行加密
        const encryptedUsername = encryptData(values.username, secretKey);
        const encryptedUEmail = encryptData(values.email, secretKey);
        const encryptedPassword = encryptData(values.password, secretKey);
        const encryptedCaptcha = encryptData(values.captcha, secretKey);
        // 发送请求时，只发送加密后的数据，包含 iv 和 ciphertext
        const encryptedResetData = {
            username: encryptedUsername.ciphertext,
            username_iv: encryptedUsername.iv,
            email:encryptedUEmail.ciphertext,
            email_iv:encryptedUEmail.iv,
            password: encryptedPassword.ciphertext,
            password_iv: encryptedPassword.iv,
            captcha: encryptedCaptcha.ciphertext,
            captcha_iv: encryptedCaptcha.iv,
        };

        const resultAction = await dispatch(updatePasswordThunk(encryptedResetData)) as { payload: RegisterRes, error?: any };


        if (updatePasswordThunk.fulfilled.match(resultAction)) {
            const {data} = resultAction.payload; // 确保从 payload 中提取 msg
            message.success(data || "密码修改成功", 3);
            navigate('/login'); // 添加这一行以使用 navigate
        } else {
            // message.error('注册请求错误，请重试');
        }

    }, [dispatch, navigate]);


    return (
        <div className="login-container">
            <div className="wrapper">
                <div className="title">修改密码</div>

                <Form form={form} className="login-form" onFinish={onFinish}>
                    <Row justify="start">
                        <Link to={"/login"}>&lt;<span> </span>返回登录</Link>
                    </Row>
                    <br/>

                    <Form.Item name="username" rules={IPT_RULE_USERNAME}>
                        <Input prefix={<UserOutlined/>} autoComplete="off" placeholder="账号"/>
                    </Form.Item>

                    <Form.Item name="email" rules={IPT_RULE_EMAIL}>
                        <Input prefix={<MailOutlined/>} placeholder="验证电子邮箱"/>
                    </Form.Item>

                    <Form.Item name="password" rules={IPT_RULE_PASSWORD}>
                        <Input
                            type={passwordVisible ? "text" : "password"}
                            autoComplete="off"
                            prefix={<LockOutlined/>}
                            placeholder="重置密码"
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
                            placeholder="确认重置密码"
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

                    <Row justify="space-around">
                        <Button type="primary" htmlType="submit" >
                            确定
                        </Button>
                        <Button htmlType="reset">重置</Button>
                    </Row>
                </Form>
            </div>
        </div>
    );
}

export default ForgetPwdPage;
