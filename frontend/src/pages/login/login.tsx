import {useCallback, useState, useEffect, useRef} from "react";
import {Form, Input, Button, Checkbox, message, Row, Image, Col} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import type {LoginData} from '../../api/auth';
import {useDispatchUser} from '../../hooks';
import './index.css'
import {EyeInvisibleOutlined, EyeOutlined, UserOutlined, LockOutlined, CheckCircleOutlined} from "@ant-design/icons";
import {setInfo} from "../../store/userSlice.tsx";
import CryptoJS from 'crypto-js'; // 引入 CryptoJS 库 加密模块

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


    useEffect(() => {
        if (!hasFetchedCaptcha.current) {
            refreshCaptcha();
            hasFetchedCaptcha.current = true; // 仅请求一次
        }
    }, [refreshCaptcha]);
    // AES 加密函数
    function encryptData(data, secretKey) {
        const iv = CryptoJS.lib.WordArray.random(16);  // 随机生成 16 字节的 IV
        const encrypted = CryptoJS.AES.encrypt(data, secretKey, { iv: iv });  // 使用 AES CBC 模式加密数据
        // 返回 IV 和密文（Base64 编码）
        return {
            iv: iv.toString(CryptoJS.enc.Base64),
            ciphertext: encrypted.ciphertext.toString(CryptoJS.enc.Base64)
        };
    }

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
                navigate('/lwr/dashboard'); // 跳转到首页
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
                <Button onClick={() => navigate('/lwr')} style={{position:"fixed",top:"10px",left:"10px",border:"none"}}>&lt;返回首页</Button>
                <div className="title">技术寻人系统登录</div>
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
                                <Link to="/lwr/forget">
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
                        <Link to="/lwr/register">
                            <Button>注册</Button>
                        </Link>
                    </Row>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;
