import { Button, Flex, Form, Input, notification, theme } from "antd";
import styles from "../index.module.css";
import { KeyOutlined } from "@ant-design/icons";
import { NavLink, useNavigate, useSearchParams } from "react-router";
import ForgetIcon from "../../../components/icon/ForgetIcon";
import { resetPwd } from "../../../services/userController";
const { useToken } = theme;

export const ResetPwd = () => {
  const { token } = useToken();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onFinish = async (values: {
    password: string;
    checkPassword: string;
  }) => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");
    const res = await resetPwd(
      email || "",
      token || "",
      values.password,
      values.checkPassword
    );
    if (res.code === 200) {
      api.success({
        message: res.message,
      });
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } else {
      api.warning({
        message: res.message,
      });
    }
  };

  return (
    <Form
      name="register"
      initialValues={{ remember: true }}
      size="large"
      onFinish={onFinish}
      className={styles.form}
    >
      {contextHolder}
      <div>
        <ForgetIcon />
        <div
          style={{
            fontSize: 20,
            color: token.colorPrimary,
          }}
        >
          重置密码
        </div>
      </div>
      <Form.Item
        name="password"
        rules={[
          { required: true, message: "请设置新密码!" },
          { min: 8, message: "密码长度至少为8位!" },
        ]}
      >
        <Input
          prefix={<KeyOutlined />}
          type="password"
          placeholder="请设置新密码!"
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
        <Input
          prefix={<KeyOutlined />}
          type="password"
          placeholder="请重复新密码!"
          className="inputHeight"
        />
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit">
          找回密码
        </Button>
      </Form.Item>
      <Form.Item>
        <Flex justify="space-between" align="center">
          <NavLink to="/login">登录账号</NavLink>
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default ResetPwd;
