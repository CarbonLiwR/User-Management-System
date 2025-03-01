import React, {useEffect, useState} from 'react';
import {message} from "antd";
import {useNavigate} from "react-router-dom";

const SSOLoginPage = () => {
    const [user, setUser] = useState<any>(null); // 用户认证信息
    const [error, setError] = useState<string>(''); // 错误信息
    const navigate = useNavigate(); // 使用 useNavigate hook

    useEffect(() => {
        // 从 URL 获取 ticket（假设 SSO 登录后将 ticket 作为查询参数传递）
        const urlParams = new URLSearchParams(window.location.search);
        const ticket = urlParams.get('ticket');

        if (ticket) {
            // console.log(JSON.stringify({ticket}))
            // 如果有 ticket，发送请求到后端获取用户信息
            const fetchUserInfo = async () => {
                try {
                    // 替换为你自己的后端 API，用 ticket 获取用户信息
                    const response = await fetch('http://127.0.0.1:8000/api/v1/auth/ssologin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',  // 设置请求头为 JSON 格式
                        },
                        body: JSON.stringify({ticket})  // 将 ticket 作为 JSON 格式的请求体发送
                    });
                    // console.log(response);
                    if (response.ok) {
                        // 解析响应体中的 JSON 数据
                        const userInfo = await response.json();
                        // console.log('用户信息:', userInfo); // 打印用户信息
                        setUser(userInfo);

                        const timer = setTimeout(() => {
                            navigate("/login",{ state: { userInfo: userInfo, tab: "sso" } });
                        }, 2000); // 等待2秒

                        // 清除定时器，防止组件卸载时仍然执行导航
                        return () => clearTimeout(timer);
                    } else {
                        // 处理请求失败的情况
                        const errorData = await response.json();
                        console.log('请求错误:', errorData);
                    }
                } catch (error) {
                    setError('无法连接到服务器');
                    console.error(error);
                }
            };

            fetchUserInfo();
        } else {
            // 如果没有 ticket，直接跳转到 SSO 登录页面
            window.location.href = 'https://uis.jxnu.edu.cn/cas/login?service=http://localhost:5173/sso/login';
        }
    }, []);


    return (
        <div>
            {!user ? (
                <h1>登录中...</h1> // 等待用户信息
            ) : (
                <div>
                    <h1>欢迎，{user?.name}!</h1> {/* 显示用户的认证信息 */}
                    <p>认证帐号：{user?.accountName}</p>
                    <p>{user?.organizationName}</p><br/>
                    <p>即将进入系统。。。</p>
                </div>
            )}
            {error && <p style={{color: 'red'}}>{error}</p>} {/* 显示错误信息 */}
        </div>
    );
};

export default SSOLoginPage;
