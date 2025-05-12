import { Button, Flex, Input, notification, Form, Switch, Select } from "antd";
import { useEffect, useState } from "react";
import { getSettingByType } from "../../../services/settingController";
import { editAuthInfo, fetchGroups } from "../../../services/adminController";

export const AuthManager = () => {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [groupOptions, setGroupOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const onFinish = async (
    values: Record<string, { value: string; id: number }>
  ) => {
    const res = await editAuthInfo(values);
    if (res.code === 200) {
      api.success({
        message: res.message,
      });
    } else {
      api.error({
        message: res.message,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSettingByType("auth");
      const initialValues: Record<
        string,
        { value: string | boolean; id: number }
      > = {};

      res.data.forEach((item: API.SettingVO) => {
        let value;
        if (item.value === "true" || item.value === "false") {
          value = item.value === "true" ? true : false;
        } else {
          value = item.value;
        }
        
        initialValues[item.name] = {
          value,
          id: item.id,
        };
      });
      form.setFieldsValue(initialValues);

      const groupResp = await fetchGroups();
      const groupOptions = groupResp.data.map(
        (item: { id: number; name: string; type: string }) => ({
          value: item.name,
          label: item.name,
        })
      );
      setGroupOptions(groupOptions);
    };
    fetchData();
  }, []);

  return (
    <Flex vertical={true} flex={1} style={{ paddingLeft: 50 }}>
      <h3>注册与登录</h3>
      {contextHolder}
      <Form
        form={form}
        style={{ maxWidth: 500 }}
        variant="underlined"
        onFinish={onFinish}
      >
        <Form.Item
          label="允许新用户注册"
          name={["registerEnabled", "value"]}
          valuePropName="checked"
          extra="是否允许新用户注册"
        >
          <Switch />
        </Form.Item>
        <Form.Item name={["registerEnabled", "id"]} hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="默认用户组"
          name={["registerGroup", "value"]}
          style={{ width: 300 }}
          extra="新注册用户默认所属组"
        >
          <Select options={groupOptions} />
        </Form.Item>
        <Form.Item name={["registerGroup", "id"]} hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="注册验证码"
          name={["registerCaptcha", "value"]}
          valuePropName="checked"
          extra="是否开启注册验证码"
        >
          <Switch />
        </Form.Item>
        <Form.Item name={["registerCaptcha", "id"]} hidden={true}>
          <Input />
        </Form.Item>

        <Form.Item
          label="登录验证码"
          name={["loginCaptcha", "value"]}
          valuePropName="checked"
          extra="是否开启登录验证码"
        >
          <Switch />
        </Form.Item>
        <Form.Item name={["loginCaptcha", "id"]} hidden={true}>
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
