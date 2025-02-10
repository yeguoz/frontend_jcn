import { Button, Flex, Form, Input, theme } from "antd";
import {
  IdcardOutlined,
  KeyOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router";
import useSettingStore from "../../../store/useSettingStore";
import { useEffect, useState } from "react";
import styles from "../index.module.css";
import { getCaptcha, register } from "../../../services/userController";
import { SESSION_CAPTCHA_REGISTER } from "../../../constant/common";
import useThemeStore from "../../../store/useThemeStore";

interface FormValues {
  email: string;
  password: string;
  checkPassword: string;
  captcha?: string;
}
const { useToken } = theme;
export const Register = () => {
  const settings = useSettingStore((state) => state.settings);
  const isDark = useThemeStore((state) => state.isDark);
  const [captcha, setCaptcha] = useState<string>();
  const navigate = useNavigate();
  const { token } = useToken();

  const onFinish = async (values: FormValues) => {
    const { email, password, checkPassword, captcha } = values;
    const userResult = await register(email, password, checkPassword, captcha);
    if (userResult.code === 200) {
      navigate("/login");
      return;
    }
    // todo 处理失败情况
  };

  const fetchCaptcha = async () => {
    const captchaResult = await getCaptcha(SESSION_CAPTCHA_REGISTER);
    if (captchaResult.code === 200) {
      setCaptcha(captchaResult.data);
    }
  };

  useEffect(() => {
    if (settings?.register_captcha) {
      fetchCaptcha();
    }
  }, [settings]);

  return (
    <Form
      name="register"
      initialValues={{ remember: true }}
      size="large"
      onFinish={onFinish}
      className={styles.form}
      style={{ backgroundColor: isDark ? "#424242" : "#fff" }}
    >
      <div>
        <IdcardOutlined style={{ fontSize: "1.57rem", color: token.colorPrimary }} />
        <div style={{ fontSize: "1.25rem" }}>注册</div>
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
          { len: 8, message: "密码长度至少为8位!" },
        ]}
      >
        <Input
          prefix={<KeyOutlined />}
          type="password"
          placeholder="密码"
          className="inputHeight"
        />
      </Form.Item>
      <Form.Item
        name="checkPassword"
        rules={[
          { required: true, message: "请再次输入密码!" },
          { len: 8, message: "密码长度至少为8位!" },
        ]}
      >
        <Input
          prefix={<KeyOutlined />}
          type="password"
          placeholder="重复密码"
          className="inputHeight"
        />
      </Form.Item>
      {settings?.register_captcha == "true" && (
        <Form.Item name="captcha" rules={[{ required: false, message: "!" }]}>
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
    </Form>
  );
};
