import {useCallback, useState, useEffect} from "react";
import {Form, Input, Button, Checkbox, message, Row, Image} from "antd";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import MyIcon from "@/components/icon";
import {saveUser, getLocalUser, saveToken} from "@/utils/index1";
import {setUserInfoAction} from "@/store/user/action";
import {login} from "@/api/auth";
import {UserInfo} from "@/types";
import {useThemeToken} from "@/hooks";
import {getCaptcha} from '@/api/auth';

const IPT_RULE_USERNAME = [{required: true, message: "请输入用户名"}];
const IPT_RULE_PASSWORD = [{required: true, message: "请输入密码"}];
const IPT_RULE_CAPTCHA = [{required: true, message: "请输入验证码"}];

function LoginPage() {
  const [btnLoad, setBtnLoad] = useState(false);
  const [captchaSrc, setCaptchaSrc] = useState("");
  const dispatch = useDispatch();
  const setUserInfo = useCallback((info: UserInfo) => dispatch(setUserInfoAction(info)), [dispatch]);
  const token = useThemeToken();

  const refreshCaptcha = async () => {
    try {
      const captcha = await getCaptcha();
      setCaptchaSrc(`data:image/png;base64, ${captcha.data.data.image}`);
    } catch (err) {
      message.error("验证码获取失败");
    }
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const onFinish = useCallback((values: any) => {
    setBtnLoad(true);
    login(values)
      .then((res) => {
        console.log(res);
        const response = res.data;
        const {data, msg} = response;

        setBtnLoad(false);
        if (!data) {
          message.error('登录失败，请重试');
          return;
        }
        const data1 = {user_id: 1, nickname: "超级管理员", account: "admin", type: "0"};
        const info = Object.assign({isLogin: true}, data1);
        saveToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6IuW8oOWQjOWtpiIsImFjY291bnQiOiJhZG1pbiIsInR5cGVfaWQiOjEsImlhdCI6MTcyOTE1MTE3NSwiZXhwIjoxNzMwNDQ3MTc1fQ.bKEbI9q2GwJw34sJ9Y-wXl6X8iTUsShVAlnfjdFwvnM');
        // saveToken(data.access_token);
        message.success(msg);
        if (values.remember) {
          saveUser(info);
        }
        setUserInfo(info);
      })
      .catch((error) => {
        setBtnLoad(false);
        // 这里处理错误，例如打印到控制台或显示给用户
        console.error(error);
        if (error.response) {
          // 服务器响应了错误信息
          const errorMsg = error.response.data.msg || '登录失败，请重试';
          message.error(errorMsg);
        } else if (error.request) {
          // 请求已经发出，但没有收到响应
          message.error('请求超时，请检查网络连接');
        } else {
          // 发生了触发请求错误的问题
          message.error('登录请求错误，请重试');
        }
      });
  }, [setUserInfo]);

  return (
    <div className="login-container" style={{backgroundColor: token.colorBgContainer}}>
      <div className="wrapper">
        <div className="title">管理系统登录</div>
        <Form
          className="login-form"
          initialValues={{
            remember: true,
            // ...getLocalUser(),
          }}
          onFinish={onFinish}
        >
          <Form.Item name="username" rules={IPT_RULE_USERNAME}>
            <Input prefix={<MyIcon type="icon_nickname"/>} placeholder="账号:admin/user"/>
          </Form.Item>

          <Form.Item name="password" rules={IPT_RULE_PASSWORD}>
            <Input
              prefix={<MyIcon type="icon_locking"/>}
              type="password"
              autoComplete="off"
              placeholder="密码:admin123/user123"
            />
          </Form.Item>
          <Form.Item name="captcha" rules={IPT_RULE_CAPTCHA}>
            <Row align="middle">
              <Input placeholder="请输入验证码" style={{width: '60%', flex: 1}}/>
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
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
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
            {/*<Button htmlType="reset">重置</Button>*/}
          </Row>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;

