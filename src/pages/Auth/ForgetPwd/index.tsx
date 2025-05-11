import { Button, Flex, Form, Input, notification, theme } from "antd";
import styles from "../index.module.css";
import { MailOutlined } from "@ant-design/icons";
import { NavLink } from "react-router";
import ForgetIcon from "../../../components/icon/ForgetIcon";
import { fetchForgetPwd } from "../../../services/userController";
import { useState } from "react";

const { useToken } = theme;

export const ForgetPwd = () => {
  const { token } = useToken();
  const [api, contextHolder] = notification.useNotification();
  const [complete, setComplete] = useState<boolean>(false);
  const onFinish = async (values: { email: string }) => {
    const res = await fetchForgetPwd(values.email);
    if (res.code === 200) {
      setComplete(true);
      api.success({
        message: res.message,
      });
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
      {!complete ? (
        <>
          <div>
            <ForgetIcon />
            <div
              style={{
                fontSize: 20,
                color: token.colorPrimary,
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
            邮件确认
          </div>
          <div style={{ marginTop: 10 }}>
            <div>一封邮件已经发送至您的邮箱</div>
            <div>请访问邮件中的链接以重置密码</div>
          </div>
        </div>
      )}
    </Form>
  );
};

export default ForgetPwd;
