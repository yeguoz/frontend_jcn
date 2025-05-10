import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  notification,
  Select,
  Switch,
} from "antd";
import { useEffect, useState } from "react";
import {
  createGroup,
  fetchPolicies,
} from "../../../../services/adminController";

const { Option } = Select;

export const AddUserGroup = () => {
  const [form] = Form.useForm();
  const [unit, setUnit] = useState(2 ** 30); // 默认GB
  const [policies, setPolicies] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const selectAfter = (
    <Select
      defaultValue={2 ** 30}
      style={{ width: 60 }}
      onChange={(value: number) => setUnit(value)}
    >
      <Option value={1}>B</Option>
      <Option value={2 ** 10}>KB</Option>
      <Option value={2 ** 20}>MB</Option>
      <Option value={2 ** 30}>GB</Option>
      <Option value={2 ** 40}>TB</Option>
    </Select>
  );

  const onFinish = async (values: {
    groupName: string;
    policyId: number;
    maxStorage: number;
    shareEnabled: boolean;
  }) => {
    const finalStorage = values.maxStorage * unit;
    const res = await createGroup(
      values.groupName,
      values.policyId,
      finalStorage,
      values.shareEnabled
    );
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
      const res = await fetchPolicies();
      const array = res.data.map(
        (item: { id: number; name: string; type: string }) => ({
          value: item.id,
          label: item.name,
        })
      );
      setPolicies(array);
    };
    fetchData();
  }, []);

  return (
    <Flex vertical={true} flex={1} style={{ paddingLeft: 50 }}>
      <h3>新建用户组</h3>
      {contextHolder}
      <Form
        form={form}
        style={{ maxWidth: 500 }}
        variant="underlined"
        onFinish={onFinish}
      >
        <Form.Item
          label="组名"
          name="groupName"
          style={{ width: 200 }}
          rules={[
            { required: true, message: "请输入组名" },
            { max: 10, message: "组名最多10个字符" },
            { min: 4, message: "组名最少4个字符" },
            { pattern: /^[a-zA-Z0-9]+$/, message: "组名只能包含数字和字母" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="存储策略"
          name="policyId"
          style={{ width: 300 }}
          rules={[{ required: true, message: "请选择存储策略" }]}
        >
          <Select
            style={{ width: 200 }}
            onChange={() => {}}
            options={policies}
          />
        </Form.Item>

        <Form.Item
          label="最大存储"
          name="maxStorage"
          style={{ width: 300 }}
          rules={[{ required: true, message: "请输入最大存储空间" }]}
        >
          <InputNumber addonAfter={selectAfter} />
        </Form.Item>

        <Form.Item label="允许分享" name="shareEnabled" valuePropName="checked">
          <Switch />
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
