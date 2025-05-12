import {
  Button,
  Flex,
  notification,
  Switch,
  Form,
  Select,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { formatBytesToUnit } from "../../../../utils/formatUtil";
import { editGroup, fetchPolicies } from "../../../../services/adminController";

const { Option } = Select;

export const EditUserGroup = () => {
  const {
    state: { id, maxStorage, shareEnabled, policyId },
  } = useLocation();

  const [form] = Form.useForm();
  const [unit, setUnit] = useState(2 ** 30); // 默认GB
  const [api, contextHolder] = notification.useNotification();
  const [options, setOptions] = useState<{ value: number; label: string }[]>(
    []
  );
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
    maxStorage: number;
    shareEnabled: boolean;
    policyId: number;
  }) => {
    const finalStorage = values.maxStorage * unit;

    const res = await editGroup(
      id,
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
      const resp = await fetchPolicies();
      const array = resp.data.map(
        (item: { id: number; name: string; type: string }) => ({
          value: item.id,
          label: item.name,
        })
      );
      setOptions(array);
    };
    fetchData();
  }, []);

  return (
    <Flex vertical={true} flex={1} style={{ paddingLeft: 50 }}>
      <h3>编辑用户组</h3>
      {contextHolder}
      <Form
        form={form}
        style={{ maxWidth: 500 }}
        variant="underlined"
        onFinish={onFinish}
        initialValues={{
          maxStorage: formatBytesToUnit(maxStorage, "GB"),
          policyId: policyId,
          shareEnabled: shareEnabled === 1,
        }}
      >
        <Form.Item
          label="存储策略"
          name="policyId"
          style={{ width: 400 }}
          rules={[{ required: true, message: "请选择存储策略" }]}
        >
          <Select style={{ width: 300 }} options={options} />
        </Form.Item>
        <Form.Item
          label="最大存储空间"
          name="maxStorage"
          style={{ width: 400 }}
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