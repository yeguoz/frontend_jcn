import Icon from "@ant-design/icons";
import { type GetProps } from "antd";

const NicknameSvg = () => (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="23657"
    width="26"
  >
    <path
      d="M864 104c52.88 0 96 43.12 96 96v640c0 52.88-43.12 96-96 96H224c-52.88 0-96-42.752-96-95.36V776c0-17.76 14.368-32 32-32 17.632 0 32 14.24 32 32v64.64c0 17.36 14.368 31.36 32 31.36h640c17.632 0 32-14.368 32-32v-640c0-17.632-14.368-32-32-32H224c-18.496 0-32 10.128-32 17.008V232c0 17.632-14.368 32-32 32-17.632 0-32-14.368-32-32v-46.992C128 140.368 171.12 104 224 104h640z m-288 128.64c158.624 0 192 104.368 192 192 0 138.992-66.24 159.232-127.248 207.232l0.256 55.888c69.248 8.496 161.488 57.12 165.984 58.112a32.032 32.032 0 0 1 24.256 38.24 31.76 31.76 0 0 1-38.24 24.256c-1.12-0.24-121.888-55.12-185.888-59.616a31.888 31.888 0 0 1-29.76-31.504l-0.608-100.624a31.792 31.792 0 0 1 13.376-26.368C642.128 553.008 704 547.12 704 425.008c0-90.88-37.12-128-128-128-92.128-0.384-128 35.744-128 128.368 0 117.632 24.128 120 83.36 165.248 7.888 6 12.64 15.376 12.64 25.376v100.64c0 17.12-13.376 31.12-30.496 32-63.632 2.992-185.632 59.232-186.752 59.488-2.384 0.624-4.88 0.864-7.248 0.864a32 32 0 0 1-7.248-63.12c4.48-0.992 97.744-50.624 167.744-58.496v-56c-67.12-57.76-96-75.632-96-206 0-127.872 64.64-192.752 192-192.752zM192 648a31.984 31.984 0 1 1 0 64H96a31.984 31.984 0 1 1 0-64h96z m-32-256c17.632 0 32 14.368 32 32v160c0 17.76-14.368 32-32 32-17.632 0-32-14.24-32-32v-160c0-17.632 14.368-32 32-32z m32-96c17.632 0 32 14.368 32 32 0 17.632-14.368 32-32 32H96c-17.632 0-32-14.368-32-32 0-17.632 14.368-32 32-32h96z"
      p-id="23658"
      fill="#fff"
    ></path>
  </svg>
);
const NicknameIcon = (props: Partial<GetProps<typeof Icon>>) => {
  return <Icon component={NicknameSvg} {...props} />;
};

export default NicknameIcon;
