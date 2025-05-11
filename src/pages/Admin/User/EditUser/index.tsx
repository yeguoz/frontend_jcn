import { Flex, Form, Select, Button, notification } from "antd";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import {
  editUser,
  fetchGroups,
  fetchPolicies,
} from "../../../../services/adminController";

export const EditUser = () => {
  const {
    state: { id, groupId, policyId, status },
  } = useLocation();

  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [options, setOptions] = useState<{ value: number; label: string }[]>(
    []
  );
  const [groupOptions, setGroupOptions] = useState<
    { value: number; label: string }[]
  >([]);

  const onFinish = async (values: {
    groupId: number;
    policyId: number;
    status: number;
  }) => {
    const resp = await editUser(
      id,
      values.groupId,
      values.policyId,
      values.status
    );
    if (resp.code === 200) {
      api.success({ message: resp.message });
    } else {
      api.warning({ message: resp.message });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetchPolicies();
      const groupResp = await fetchGroups();
      const array = resp.data.map(
        (item: { id: number; name: string; type: string }) => ({
          value: item.id,
          label: item.name,
        })
      );
      const groupArray = groupResp.data.map(
        (item: { id: number; name: string; type: string }) => ({
          value: item.id,
          label: item.name,
        })
      );
      setOptions(array);
      setGroupOptions(groupArray);
    };
    fetchData();
  }, []);

  return (
    <Flex vertical={true} flex={1} style={{ paddingLeft: 50 }}>
      <h3>编辑用户</h3>
      {contextHolder}
      <Form
        form={form}
        style={{ maxWidth: 500 }}
        onFinish={onFinish}
        initialValues={{
          groupId: groupId,
          policyId: policyId,
          status: status,
        }}
        variant="underlined"
      >
        <Form.Item
          label="用户组"
          name="groupId"
          style={{ width: 200 }}
          rules={[{ required: true, message: "请选择组" }]}
        >
          <Select style={{ width: 300 }} options={groupOptions} />
        </Form.Item>
        <Form.Item
          label="存储策略"
          name="policyId"
          style={{ width: 400 }}
          rules={[{ required: true, message: "请选择存储策略" }]}
        >
          <Select style={{ width: 300 }} options={options} />
        </Form.Item>

        <Form.Item
          label="状态"
          name="status"
          rules={[{ required: true, message: "请选择状态" }]}
        >
          <Select
            style={{ width: 300 }}
            options={[
              { value: 0, label: "正常" },
              { value: 1, label: "未激活" },
            ]}
          />
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
