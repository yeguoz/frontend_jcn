import { Flex, GetProp, MenuProps, TableColumnsType } from "antd";
import formatFileSizeUtil from "../utils/formatFileSizeUtil";
import dateFormatUtil from "../utils/dateFormatUtil";
import {
  FolderOpenOutlined,
  LoginOutlined,
  LogoutOutlined,
  PictureOutlined,
  UserAddOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import ManagementIcon from "../components/icon/ManagementIcon";
import MusicIcon from "../components/icon/MusicIcon";
import DocumentIcon from "../components/icon/DocumentIcon";

type MenuItem = GetProp<MenuProps, "items">[number];

export const SESSION_CAPTCHA_REGISTER = "sessionCaptchaRegister";
export const SESSION_CAPTCHA_LOGIN = "sessionCaptchaLogin";
const extensionToType: { [key: string]: Set<string> } = {
  txt: new Set(["txt", "log", "csv", "dat"]),
  word: new Set(["doc", "docx"]),
  excel: new Set(["xls", "xlsx"]),
  ppt: new Set(["ppt", "pptx"]),
  audio: new Set(["mp3", "flac", "wav", "aac", "ogg"]),
  img: new Set(["jpg", "jpeg", "png", "gif", "bmp", "webp", "tiff", "svg","ico"]),
  gif: new Set(["gif"]),
  video: new Set(["mp4", "mkv", "avi", "wmv", "mov", "flv","movie"]),
  code: new Set([
    "tsx",
    "ts",
    "js",
    "jsx",
    "py",
    "java",
    "cpp",
    "c",
    "php",
    "go",
    "rb",
    "sh",
    "bat",
    "cmd",
    "ps1",
    "lua",
    "swift",
    "kt",
    "cs",
    "m",
    "r",
    "pl",
    "scala",
    "yaml",
    "yml",
  ]),
  zip: new Set(["zip", "rar", "7z", "tar", "gz", "cab"]),
  font: new Set(["ttf", "otf", "woff", "woff2"]),
  exe: new Set(["exe", "so"]),
  apk: new Set(["apk"]),
  pdf: new Set(["pdf"]),
  markdown: new Set(["md"]),
  yaml: new Set(["yaml", "yml"]),
  dll: new Set(["dll"]),
  threeD: new Set(["obj", "stl", "glb", "fbx"]),
  database1: new Set(["sql", "mdb", "accdb"]),
  html: new Set(["html", "htm", "xhtml"]),
  css: new Set(["css", "less", "scss", "sass"]),
  json: new Set(["json"]),
  xml: new Set(["xml"]),
  conf: new Set(["conf", "ini", "properties"]),
  epub: new Set(["epub"]),
};

export const getFileType = (extension: string): string | undefined => {
  const lowerExt = extension.toLowerCase();
  for (const [type, extensions] of Object.entries(extensionToType)) {
    if (extensions.has(lowerExt)) {
      return type;
    }
  }
  return "unknown";
};

export const filesColumns: TableColumnsType<API.FileDTO> = [
  {
    title: "文件名",
    dataIndex: "name",
    showSorterTooltip: false,
    width: "50%",
    sorter: {
      compare: (a, b) => a.name.localeCompare(b.name),
    },
    render: (value, record) => {
      const extension = record.name.split(".").pop() || "";
      const fileType = getFileType(extension);
      return (
        <a>
          <Flex align="center" gap={10}>
            {record.type === "folder" ? (
              <img src="/src/assets/images/folder.svg" alt="" width={30} />
            ) : (
              <img
                src={`/src/assets/images/${fileType}.svg`}
                alt=""
                width={30}
              />
            )}
            <span>{value}</span>
          </Flex>
        </a>
      );
    },
  },
  {
    title: "大小",
    dataIndex: "size",
    showSorterTooltip: false,
    width: "15%",
    sorter: {
      compare: (a, b) => a.size - b.size,
    },
    render: (value) => {
      return value && <span>{formatFileSizeUtil(value)}</span>;
    },
  },
  {
    title: "修改日期",
    dataIndex: "updatedAt",
    showSorterTooltip: false,
    render: (value) => {
      if (!value) return null;
      return <span>{dateFormatUtil(value)}</span>;
    },
    sorter: {
      compare: (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
  },
];
export const USER = "User";
export const ADMIN = "Admin";
export const authItems: MenuItem[] = [
  {
    label: <span style={{ fontSize: '1rem',marginLeft: '1rem' }}>登录</span>,
    key: "login",
    icon: <LoginOutlined style={{fontSize:'1rem'}}/>,
  },
  {
    label: <span style={{ fontSize: '1rem',marginLeft: '1rem' }}>注册</span>,
    key: "register",
    icon: <UserAddOutlined style={{fontSize:'1rem'}}/>,
  },
];
export const homeItems: MenuItem[] = [
  {
    label: <span style={{ fontSize: "1rem" }}>我的文件</span>,
    key: "home",
    icon: <FolderOpenOutlined />,
    theme: "dark",
    children: [
      {
        label: "视频",
        key: "video",
        icon: <VideoCameraOutlined />,
      },
      {
        label: "图片",
        key: "picture",
        icon: <PictureOutlined />,
      },
      {
        label: "音乐",
        key: "music",
        icon: <MusicIcon />,
      },
      {
        label: "文档",
        key: "document",
        icon: <DocumentIcon />,
      },
    ],
  },
];

export const adminItems: MenuProps["items"] = [
  {
    key: "admin",
    label: (
      <div
        style={{
          fontSize: 16,
          paddingRight: 70,
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        <span style={{ marginRight: 30 }}>
          <ManagementIcon />
        </span>
        <span>管理员页</span>
      </div>
    ),
  },
  {
    key: "logout",
    label: (
      <div
        style={{
          fontSize: 16,
          paddingRight: 70,
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        <span style={{ marginRight: 30 }}>
          <LogoutOutlined />
        </span>
        <span>退出登录</span>
      </div>
    ),
  },
];
export const userItems: MenuProps["items"] = [
  {
    key: "logout",
    label: (
      <div
        style={{
          fontSize: 16,
          paddingRight: 70,
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        <span style={{ marginRight: 30 }}>
          <LogoutOutlined />
        </span>
        <span>退出登录</span>
      </div>
    ),
  },
];
