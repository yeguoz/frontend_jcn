import { Button, Flex, Input, notification, Form } from "antd";
import { useEffect } from "react";
import { getSettingByType } from "../../../../services/settingController";
import { editSiteInfo } from "../../../../services/adminController";

export const Site = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (
    values: Record<string, { value: string; id: number }>
  ) => {
    const res = await editSiteInfo(values);
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
      const res = await getSettingByType("site");
      const initialValues: Record<string, { value: string; id: number }> = {};

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
      <h3>站点信息</h3>
      {contextHolder}
      <Form
        form={form}
        style={{ maxWidth: 500 }}
        variant="underlined"
        onFinish={onFinish}
      >
        <Form.Item
          label="站点URL"
          name={["url", "value"]}
          style={{ width: 400 }}
          rules={[
            { required: true, message: "请输入站点URL" },
            {
              pattern: /^https?:\/\/[^\s]+$/,
              message: "请输入正确的URL http or https",
            },
          ]}
          extra="站点URL，https或http，带端口"
        >
          <Input />
        </Form.Item>
        <Form.Item name={["url", "id"]} hidden={true}>
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
