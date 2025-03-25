import {useCallback, useState, useEffect, useRef} from "react";
import {Form, Input, Button, Checkbox, message, Row, Image, Col} from "antd";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import type {LoginData} from '../../api/auth';
import {useDispatchUser} from '../../hooks';
import './index.css'
import {EyeInvisibleOutlined, EyeOutlined, UserOutlined, LockOutlined, CheckCircleOutlined} from "@ant-design/icons";
import {setInfo} from "../../store/userSlice.tsx";
import CryptoJS from 'crypto-js';
import axios from "axios";

const IPT_RULE_USERNAME = [{required: true, message: "请输入账号"}];
const IPT_RULE_PASSWORD = [{required: true, message: "请输入密码"}];
const IPT_RULE_CAPTCHA = [{required: true, message: "请输入验证码"}];

function LoginPage() {
    const [btnLoad, setBtnLoad] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate(); // 使用 useNavigate hook
    const captchaSrc = useSelector((state: RootState) => state.user.captcha);
    const {login, fetchUser, getCaptcha} = useDispatchUser();
    const hasFetchedCaptcha = useRef(false);
    const refreshCaptcha = useCallback(() => {
        getCaptcha();
    }, [getCaptcha]);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    const location = useLocation();
    const {userInfo, tab} = location.state || {}; // 获取状态信息

    useEffect(() => {
        if (tab === "sso" && userInfo?.user) {
            axios.get(`api/v1/auth/sso/${userInfo.user}`)
                .then(response => {
                    // console.log("SSO 用户信息:", response);

                    if(response == "注册"){
                        const secretKeyBase64 = "G8ZyYyZ0Xf5x5f6uZrwf6ft4gD0pniYAkHp/Y6f4Pv4=";  // Base64 编码的密钥
                        const secretKey = CryptoJS.enc.Base64.parse(secretKeyBase64);  // 解码为字节数组
                        // 对数据进行加密
                        const encryptedUsername = encryptData(userInfo.user, secretKey);
                        const encryptedNickname = encryptData(userInfo.name, secretKey);
                        axios.post(`api/v1/auth/sso/register`, {
                            username: encryptedUsername.ciphertext,
                            username_iv: encryptedUsername.iv,
                            nickname: encryptedNickname.ciphertext,
                            nickname_iv: encryptedNickname.iv,
                        }).then(response => {
                            // console.log("SSO 注册响应:", response);
                            if (response === "注册成功") {
                                message.success("SSO 用户注册成功");
                                // console.log("用户信息:", userInfo);
                                axios.get(`api/v1/auth/sso/${userInfo.user}`)
                                    .then(response => {
                                        handleSSOLogin(response);
                                    })

                            } else {
                                message.error("SSO 用户注册失败，请重试");
                            }
                        })
                    }
                    else
                    {  handleSSOLogin(response);}

                })
                .catch(error => {
                    console.error("SSO 检查失败:", error);
                });
        }
    }, []); // 监听 userInfo 和 tab 变化

    useEffect(() => {
        if (!hasFetchedCaptcha.current) {
            refreshCaptcha();
            hasFetchedCaptcha.current = true; // 仅请求一次
        }
    }, [refreshCaptcha]);

    // AES 加密函数
    function encryptData(data, secretKey) {
        const iv = CryptoJS.lib.WordArray.random(16);  // 随机生成 16 字节的 IV
        const encrypted = CryptoJS.AES.encrypt(data, secretKey, {iv: iv});  // 使用 AES CBC 模式加密数据
        // 返回 IV 和密文（Base64 编码）
        return {
            iv: iv.toString(CryptoJS.enc.Base64),
            ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64)
        };
    }

    const handleSSOLogin = async (userInfo: any) => {
        try {
            // console.log("SSO 用户信息:", userInfo);
            if (!userInfo?.username) {
                message.error("用户信息缺失");
                return;
            }

            const secretKeyBase64 = "G8ZyYyZ0Xf5x5f6uZrwf6ft4gD0pniYAkHp/Y6f4Pv4=";
            const secretKey = CryptoJS.enc.Base64.parse(secretKeyBase64);

            // 确保 userInfo.username 正确
            const encryptedUsername = encryptData(userInfo.username, secretKey);

            // 发送 SSO 登录请求
            const response = await axios.post("api/v1/auth/ssologin", {
                username: encryptedUsername.ciphertext,
                username_iv: encryptedUsername.iv,
            }, {withCredentials: true});

            // console.log("SSO 登录响应:", response);

            // 确保请求成功
            if (response?.access_token && response?.user) {
                const {access_token, user} = response;

                localStorage.setItem("access_token", access_token);

                localStorage.setItem("userInfo", JSON.stringify(user));

                dispatch(setInfo(user));

                message.success("SSO 登录成功");
                navigate("/"); // 跳转到首页（如果有）
            } else {
                message.error("SSO 登录失败，未返回用户信息");
            }

        } catch (error) {
            console.error("SSO 登录错误:", error);
            message.error("SSO 登录请求失败");
        }
    };


    const onFinish = useCallback((values: LoginData) => {
        setBtnLoad(true);
        const secretKeyBase64 = "G8ZyYyZ0Xf5x5f6uZrwf6ft4gD0pniYAkHp/Y6f4Pv4=";  // Base64 编码的密钥
        const secretKey = CryptoJS.enc.Base64.parse(secretKeyBase64);  // 解码为字节数组
        // 对数据进行加密
        const encryptedUsername = encryptData(values.username, secretKey);
        const encryptedPassword = encryptData(values.password, secretKey);
        const encryptedCaptcha = encryptData(values.captcha, secretKey);

        // 发送请求时，只发送加密后的数据，包含 iv 和 ciphertext
        const encryptedLoginData = {
            username: encryptedUsername.ciphertext,
            username_iv: encryptedUsername.iv,
            password: encryptedPassword.ciphertext,
            password_iv: encryptedPassword.iv,
            captcha: encryptedCaptcha.ciphertext,
            captcha_iv: encryptedCaptcha.iv,
        };

        login(encryptedLoginData)
            .unwrap()
            .then(() => {
                return fetchUser().unwrap();
            })
            .then((userInfo) => {
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                dispatch(setInfo(userInfo));
                navigate('/'); // 跳转到首页
            })
            .catch((error) => {
                setBtnLoad(false);
                console.error("Login error:", error);
                message.error(error.message || '登录失败，请重试');
            });
    }, [login, fetchUser, dispatch, navigate]);


    return (
        <div className="login-container">
            <div className="wrapper">
                <Button onClick={() => navigate('/')}
                        style={{position: "fixed", top: "10px", left: "10px", border: "none"}}>&lt;返回首页</Button>
                <div className="title">用户管理系统登录</div>
                <Form
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item name="username" rules={IPT_RULE_USERNAME}>
                        <Input
                            prefix={<UserOutlined/>}
                            placeholder="请输入账号"
                        />
                        {/*<Input placeholder="账号:admin/user"/>*/}
                    </Form.Item>
                    <Form.Item name="password" rules={IPT_RULE_PASSWORD}>
                        <Input
                            type={passwordVisible ? "text" : "password"}
                            autoComplete="off"
                            // placeholder="密码:admin123/user123"
                            placeholder="请输入密码"
                            prefix={<LockOutlined/>}

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
                    <Form.Item>
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>记住我</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col>
                                <Link to="/forget">
                                    <span>忘记密码</span>
                                </Link>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Row justify="space-around">
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            loading={btnLoad}
                        >
                            登录
                        </Button>
                        <Link to="/register">
                            <Button>注册</Button>
                        </Link>

                    </Row>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "8px",
                        alignItems: "center",
                        height: "100%"
                    }}>
                        <Button
                            style={{
                                display: "flex",
                                height: "40px",
                                borderRadius: "10px",
                                gap: "8px",
                                marginTop: "20px",
                                width: "300px",
                            }}
                        >
                            <Link to="/sso/login">
                            <span className="social-logo-wrapper">
                                <img src="/src/assets/images/jxnu.png"
                                     style={{width: "23px", height: "23px", verticalAlign: "middle"}}/>
                            </span>
                                <span>&emsp;</span>
                                <span
                                    style={{
                                        verticalAlign: "middle",
                                        fontSize: "14px"
                                    }}>使用江西师范大学身份授权登录
                                </span>
                            </Link>
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;
