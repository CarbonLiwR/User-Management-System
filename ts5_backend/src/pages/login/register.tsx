import {useCallback, useState, useEffect} from "react";
import {Form, Input, Button, Checkbox, message, Row, Image} from "antd";
import {useDispatch} from "react-redux";
import MyIcon from "@/components/icon";
import { Link } from "react-router-dom";
import {saveUser, getLocalUser, saveToken} from "@/utils/index1";
import {register} from "@/api/auth";
import {useThemeToken} from "@/hooks";
import {getCaptcha} from '@/api/auth';
import form from "@/pages/form";

const IPT_RULE_NICKNAME = [{required: true, message: "请输入昵称"}];
const IPT_RULE_USERNAME = [{required: true, message: "请输入用户名"}];
const IPT_RULE_PASSWORD = [{required: true, message: "请输入密码"}];
const IPT_RULE_EMAIL = [{required: true,  message: "请输入有效的电子邮箱"}];
const IPT_RULE_CAPTCHA = [{required: true, message: "请输入验证码"}];

function RegisterPage() {
  const [form] = Form.useForm();
  const [captchaSrc, setCaptchaSrc] = useState("");
  const dispatch = useDispatch();
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

  const validateConfirmPassword = (_: any, value: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const password = form.getFieldValue('password');
    if (value && value !== password) {
      reject("两次输入的密码不一致");
    } else {
      resolve();
    }
  });
};


  const onFinish = useCallback((values: any) => {
  console.log(values);
  register(values) // 使用注册方法
    .then((res) => {
      const { data, msg, code } = res;
      console.log(res);
      if (code === 403 && !data) {
        message.error("注册失败：用户已存在或不符合注册条件");
        return;
      }
      // 假设注册成功后，需要保存用户信息并设置登录状态
      const info = Object.assign({ isLogin: true }, data);
      message.success(msg || "注册成功");
      // 可能还需要保存用户信息到本地存储或全局状态等
    })
    .catch((error) => {
      // 这里处理错误，例如打印到控制台或显示给用户
      console.error(error);
      if (error.response) {
        // 服务器端返回的HTTP状态码和错误信息
        const { status, data } = error.response;
        const errorMsg = data.msg || '注册失败';
        message.error(`${errorMsg}`);
      } else if (error.request) {
        // 请求已经发出，但没有收到响应
        message.error('请求超时，请检查网络连接');
      } else {
        // 发生了触发请求错误的问题
        message.error('注册请求错误，请重试');
      }
    });
}, []);

  return (
    <div className="login-container">
      <div className="wrapper">
        <div className="title">管理系统注册</div>

        <Form
          form={form}
          className="login-form"
          onFinish={onFinish}
        >
          <Row justify="start">
            <Link to={"/login"}><MyIcon type="icon_back"/>已有账号，去登录</Link>
          </Row>
          <br></br>

          <Form.Item name="nickname" rules={IPT_RULE_NICKNAME}>
            <Input prefix={<MyIcon type="icon_nickname"/>} placeholder="昵称"/>
          </Form.Item>

          <Form.Item name="username" rules={IPT_RULE_USERNAME}>
            <Input prefix={<MyIcon type="icon_nickname"/>} autoComplete="off" placeholder="账号"/>
          </Form.Item>

          <Form.Item name="email" rules={IPT_RULE_EMAIL}>
            <Input prefix={<MyIcon type="icon_email"/>} type="" placeholder="电子邮箱"/>
          </Form.Item>

          <Form.Item name="password" rules={IPT_RULE_PASSWORD}>
            <Input prefix={<MyIcon type="icon_locking"/>} type="password" autoComplete="off" placeholder="密码"/>
          </Form.Item>

          <Form.Item
            name="confirm"
            rules={[
              { required: true, message: "请确认密码" },
              { validator: validateConfirmPassword } // 使用 validator 函数
            ]}
          >
            <Input
              prefix={<MyIcon type="icon_locking" />}
              type="password"
              autoComplete="off"
              placeholder="确认密码"
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

          <Row justify="space-around">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              注册
            </Button>
            <Button htmlType="reset">重置</Button>
          </Row>

        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
