import { Button, Flex, Form, Input, notification, theme } from "antd";
import { IdcardOutlined, KeyOutlined, MailOutlined } from "@ant-design/icons";
import { NavLink } from "react-router";
import useSettingStore from "../../../store/useSettingStore";
import { useEffect, useState } from "react";
import styles from "../index.module.css";
import { getCaptcha, register } from "../../../services/userController";
import { SESSION_CAPTCHA_REGISTER } from "../../../constants/common";

interface FormValues {
  email: string;
  password: string;
  checkPassword: string;
  captcha?: string;
}

const { useToken } = theme;

export const Register = () => {
  const authSettings = useSettingStore((state) => state.authSettings);
  const [api, contextHolder] = notification.useNotification();
  const [captcha, setCaptcha] = useState<string>();
  const { token } = useToken();
  const [complete, setComplete] = useState<boolean>(false);

  const onFinish = async (values: FormValues) => {
    const { email, password, checkPassword, captcha } = values;
    const userResult = await register(email, password, checkPassword, captcha);
    if (userResult.data) {
      api.success({
        message: userResult.message,
      });
      setComplete(true);
    } else {
      api.warning({
        message: userResult.message,
      });
    }
  };

  const fetchCaptcha = async () => {
    const captchaResult = await getCaptcha(SESSION_CAPTCHA_REGISTER);
    if (captchaResult.code === 200) {
      setCaptcha(captchaResult.data);
    }
  };

  useEffect(() => {
    if (authSettings?.get("registerCaptcha")) {
      fetchCaptcha();
    }
  }, [authSettings]);

  return (
    <>
      {contextHolder}
      <Form
        name="register"
        initialValues={{ remember: true }}
        size="large"
        onFinish={onFinish}
        className={styles.form}
      >
        {!complete ? (
          <>
            <div>
              <IdcardOutlined
                style={{ fontSize: 25, color: token.colorPrimary }}
              />
              <div
                style={{
                  fontSize: 20,
                  color: token.colorPrimary,
                }}
              >
                注册
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
            <Form.Item
              name="checkPassword"
              rules={[
                { required: true, message: "请再次输入密码!" },
                { min: 8, message: "密码长度至少为8位!" },
              ]}
            >
              <Input.Password
                prefix={<KeyOutlined />}
                placeholder="重复密码"
                className="inputHeight"
              />
            </Form.Item>
            {authSettings?.get("registerCaptcha") == "true" && (
              <Form.Item
                name="captcha"
                rules={[{ required: false, message: "!" }]}
              >
                <Input
                  placeholder="请输入验证码"
                  className="inputHeight"
                  suffix={
                    <img
                      width={150}
                      alt="captcha"
                      src={captcha}
                      style={{ cursor: "pointer" }}
                      onClick={fetchCaptcha}
                    />
                  }
                />
              </Form.Item>
            )}
            <Form.Item>
              <Button block type="primary" htmlType="submit">
                注册
              </Button>
            </Form.Item>
            <Form.Item>
              <Flex justify="space-between" align="center">
                <NavLink to="/forget">忘记密码</NavLink>
                <NavLink to="/login">登录账号</NavLink>
              </Flex>
            </Form.Item>
          </>
        ) : (
          <div>
            <MailOutlined style={{ fontSize: 25, color: token.colorPrimary }} />
            <div
              style={{
                fontSize: 20,
                color: token.colorPrimary,
              }}
            >
              邮件激活
            </div>
            <div style={{ marginTop: 10 }}>
              <div>一封激活邮件已经发送至您的邮箱</div>
              <div>请访问邮件中的链接以继续完成注册</div>
            </div>
          </div>
        )}
      </Form>
    </>
  );
};
