import { message, notification, Tooltip } from "antd";
import React, { useState } from "react";
import { Avatar, Card, Flex } from "antd";
import {
  EnterOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  KeyOutlined,
  LockOutlined,
  RestOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import dateFormatUtil from "../../../utils/dateFormatUtil";
import {
  deleteShare,
  updatePreEnabled,
  updatePwdEnabled,
} from "../../../services/shareController";
import { generateRandomPwd } from "../../../utils/generatePwd";

const ShareItemCard = React.memo(
  ({ data, src }: { data: API.MyShareVO; src: string }) => {
    const [isPublic, setIsPublic] = useState(data.passwordEnabled === 0);
    const [canPreview, setCanPreview] = useState(data.previewEnabled === 1);
    const [api, contextHolder] = notification.useNotification();
    const [deleted, setDeleted] = useState(false);

    const handleTogglePublic = async () => {
      const pwdEnabled = isPublic ? 1 : 0;
      const pwd = pwdEnabled === 0 ? data.password : generateRandomPwd();
      const res = await updatePwdEnabled(data.id, pwdEnabled, pwd);
      if (res.code === 200) {
        setIsPublic(!isPublic);
        data.password = pwd;
        data.passwordEnabled = pwdEnabled;
        api.success({
          message: res.message,
        });
      } else {
        api.warning({
          message: res.message,
        });
      }
    };

    const handleTogglePreview = async () => {
      const previewEnabled = canPreview ? 0 : 1;
      const res = await updatePreEnabled(data.id, previewEnabled);
      if (res.code === 200) {
        setCanPreview(!canPreview);
        data.previewEnabled = previewEnabled;
        api.success({
          message: res.message,
        });
      } else {
        api.warning({
          message: res.message,
        });
      }
    };

    const onDelete = async () => {
      const res = await deleteShare(data.id);
      if (res.code === 200) {
        // TODO: 刷新页面
        api.success({
          message: res.message,
        });
        setDeleted(true);
      } else {
        api.warning({
          message: res.message,
        });
      }
    };

    const onEnter = () => {
      const protocol = window.location.protocol;
      const host = window.location.hostname;
      const port = window.location.port;
      const baseUrl =
        data.passwordEnabled === 1
          ? `${protocol}//${host}:${port}/s/${data.shortId}?pwd=${data.password}`
          : `${protocol}//${host}:${port}/s/${data.shortId}`;
      window.open(baseUrl, "_blank");
    };

    const onViewPwd = () => {
      message.success("密码为：" + data.password);
    };

    const wrapAction = (
      icon: React.ReactNode,
      onClick?: () => void,
      title?: string
    ) => (
      <Tooltip title={title}>
        <span
          style={{
            pointerEvents: deleted ? "none" : "auto",
            opacity: deleted ? 0.4 : 1,
            cursor: deleted ? "not-allowed" : "pointer",
          }}
          onClick={deleted ? undefined : onClick}
        >
          {icon}
        </span>
      </Tooltip>
    );

    const actions = [
      wrapAction(<EnterOutlined />, onEnter, "打开"),
      wrapAction(
        isPublic ? <UnlockOutlined /> : <LockOutlined />,
        handleTogglePublic,
        isPublic ? "变更为私密" : "变更为公开"
      ),
      !isPublic && wrapAction(<KeyOutlined />, onViewPwd, "私密访问码"),
      wrapAction(
        canPreview ? <EyeOutlined /> : <EyeInvisibleOutlined />,
        handleTogglePreview,
        canPreview ? "变更为不可预览" : "变更为可预览"
      ),
      wrapAction(<RestOutlined />, onDelete, "删除"),
    ].filter(Boolean);

    return (
      <Card actions={actions}>
        <Card.Meta
          avatar={<Avatar src={src} />}
          title={data.fileName || data.sourceName}
          description={deleted ? "已删除" : null}
        />
        {contextHolder}
        {!deleted && (
          <Flex vertical style={{ marginTop: 10 }}>
            <span>创建时间：{dateFormatUtil(data.createdAt)}</span>
            <span>
              过期时间：
              {data.expireTime === null
                ? "永久有效"
                : dateFormatUtil(data.expireTime)}
            </span>
          </Flex>
        )}
      </Card>
    );
  }
);

export default ShareItemCard;
