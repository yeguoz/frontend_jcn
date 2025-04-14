import { Button, Flex, Form, Input, theme } from "antd";
import styles from "../index.module.css";
import { KeyOutlined, MailOutlined } from "@ant-design/icons";
import { NavLink } from "react-router";
import ForgetIcon from "../../../components/icon/ForgetIcon";

const { useToken } = theme;
export const Forget = () => {
  const { token } = useToken();
  
  const onFinish = async () => {};

  return (
    <Form
      name="register"
      initialValues={{ remember: true }}
      size="large"
      onFinish={onFinish}
      className={styles.form}
    >
      <div>
        <ForgetIcon />
        <div
          style={{
            fontSize: 20,
            color:token.colorPrimary,
          }}
        >
          忘记密码
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
          { required: true, message: "请设置新密码!" },
          { len: 8, message: "密码长度至少为8位!" },
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
          { len: 8, message: "密码长度至少为8位!" },
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

export default Forget;
