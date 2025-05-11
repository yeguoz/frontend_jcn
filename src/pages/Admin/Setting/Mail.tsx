import { Button, Flex, Input, notification, Form } from "antd";
import { getSettingByType } from "../../../services/settingController";
import TextArea from "antd/es/input/TextArea";
import { editMailInfo } from "../../../services/adminController";
import { useEffect } from "react";

export const Mail = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (
    values: Record<string, { value: string; id: number }>
  ) => {
    const res = await editMailInfo(values);
    if (res.code === 200) {
      api.success({
        message: res.message,
      });
    } else {
      api.warning({
        message: res.message,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSettingByType("mail");
      const initialValues: Record<
        string,
        { value: string | boolean; id: number }
      > = {};

      res.data.forEach((item: API.SettingVO) => {
        initialValues[item.name] = {
          value: item.value,
          id: item.id,
        };
      });
      form.setFieldsValue(initialValues);
    };
    fetchData();
  }, []);

  return (
    <Flex vertical={true} flex={1} style={{ paddingLeft: 50 }}>
      <h3>邮件配置</h3>
      {contextHolder}
      <Form
        form={form}
        style={{ maxWidth: 500 }}
        variant="underlined"
        onFinish={onFinish}
      >
        <Form.Item
          label="SMTP服务器"
          name={["host", "value"]}
          extra="SMTP服务器地址"
        >
          <Input />
        </Form.Item>
        <Form.Item name={["host", "id"]} hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="SMTP端口"
          name={["port", "value"]}
          extra="SMTP服务器端口"
        >
          <Input />
        </Form.Item>
        <Form.Item name={["port", "id"]} hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="SMTP用户名"
          name={["username", "value"]}
          extra="发件人用户名一般为邮箱地址"
        >
          <Input />
        </Form.Item>
        <Form.Item name={["username", "id"]} hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="SMTP密码"
          name={["password", "value"]}
          extra="SMTP密码"
        >
          <Input.Password />
        </Form.Item>
        <Form.Item name={["password", "id"]} hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="SMTP发件人"
          name={["personal", "value"]}
          extra="发件人显示名称"
        >
          <Input />
        </Form.Item>
        <Form.Item name={["personal", "id"]} hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="注册邮件子主题"
          name={["registerSubject", "value"]}
          extra="注册邮件子主题"
        >
          <Input />
        </Form.Item>
        <Form.Item name={["registerSubject", "id"]} hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="注册邮件模板"
          name={["registerTemplate", "value"]}
          extra="注册邮件模板"
        >
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item name={["registerTemplate", "id"]} hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="忘记密码邮件子主题"
          name={["forgetSubject", "value"]}
          extra="忘记密码邮件子主题"
        >
          <Input />
        </Form.Item>
        <Form.Item name={["forgetSubject", "id"]} hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="忘记密码邮件模板"
          name={["forgetTemplate", "value"]}
          extra="忘记密码邮件模板"
        >
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item name={["forgetTemplate", "id"]} hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};
