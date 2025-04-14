import React, { useEffect, useState } from "react";
import { KeyOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Flex, notification, theme } from "antd";
import { NavLink } from "react-router";
import useSettingStore from "../../../store/useSettingStore";
import { getCaptcha, login } from "../../../services/userController";
import styles from "../index.module.css";
import useAuthStore from "../../../store/useAuthStore";
import { SESSION_CAPTCHA_LOGIN } from "../../../constants/common";
import useNavStore from "../../../store/useNavStore";

interface FormValues {
  email: string;
  password: string;
  captcha?: string;
}
const { useToken } = theme;
const Login: React.FC = () => {
  const settings = useSettingStore((state) => state.settings);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuth = useAuthStore((state) => state.setIsAuth);
  const setIsOpen = useNavStore((state) => state.setIsOpen);
  const [captcha, setCaptcha] = useState<string>();
  const [api, contextHolder] = notification.useNotification();
  const { token } = useToken();

  const onFinish = async (values: FormValues) => {
    const { email, password, captcha } = values;
    const userResult = await login(email, password, captcha);

    if (userResult.data) {
      setUser(userResult.data);
      setIsAuth(true);
      setIsOpen(true);
    } else {
      api.warning({
        message: userResult.message,
      });
      fetchCaptcha();
    }
  };

  const fetchCaptcha = async () => {
    const captchaResult = await getCaptcha(SESSION_CAPTCHA_LOGIN);
    if (captchaResult.code === 200) {
      setCaptcha(captchaResult.data);
    }
  };

  useEffect(() => {
    if (settings?.login_captcha) {
      fetchCaptcha();
    }
  }, [settings]);

  return (
    <>
      {contextHolder}
      <Form
        name="login"
        initialValues={{ remember: true }}
        size="large"
        onFinish={onFinish}
        className={styles.form}
      >
        <div>
          <LockOutlined
            style={{
              fontSize: 25,
              color: token.colorPrimary,
            }}
          />
          <div
            style={{
              fontSize: 20,
              color: token.colorPrimary,
            }}
          >
            登录
          </div>
        </div>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "请输入邮箱!" },
            {
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "请输入有效的邮箱地址!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="电子邮箱"
            className="inputHeight"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "请输入密码!" },
            { min: 8, message: "密码长度至少为8位!" },
          ]}
        >
          <Input.Password
            prefix={<KeyOutlined />}
            placeholder="密码"
            className="inputHeight"
          />
        </Form.Item>
        {settings?.login_captcha == "true" && (
          <Form.Item name="captcha" rules={[{ required: false, message: "!" }]}>
            <Input
              placeholder="请输入验证码"
              suffix={
                <img
                  width={150}
                  alt="captcha"
                  src={captcha}
                  style={{ cursor: "pointer", borderRadius: 6 }}
                  onClick={fetchCaptcha}
                />
              }
              className="inputHeight"
            />
          </Form.Item>
        )}
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between" align="center">
            <NavLink to="/forget">忘记密码</NavLink>
            {settings?.register_enabled == "true" && (
              <NavLink to="/register">注册账号</NavLink>
            )}
          </Flex>
        </Form.Item>
      </Form>
    </>
  );
};

export default Login;
