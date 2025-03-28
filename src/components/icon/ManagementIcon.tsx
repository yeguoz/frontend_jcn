import Icon from "@ant-design/icons";
import { type GetProps } from "antd";

const ManagementSvg = () => (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="66302"
    width="18"
  >
    <path
      d="M384 96H192a96 96 0 0 0-96 96v192a96 96 0 0 0 96 96h192a96 96 0 0 0 96-96V192a96 96 0 0 0-96-96z m32 288a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V192a32 32 0 0 1 32-32h192a32 32 0 0 1 32 32v192zM384 544H192a96 96 0 0 0-96 96v192a96 96 0 0 0 96 96h192a96 96 0 0 0 96-96v-192a96 96 0 0 0-96-96z m32 288a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32h192a32 32 0 0 1 32 32v192zM832 544h-192a96 96 0 0 0-96 96v192a96 96 0 0 0 96 96h192a96 96 0 0 0 96-96v-192a96 96 0 0 0-96-96z m32 288a32 32 0 0 1-32 32h-192a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32h192a32 32 0 0 1 32 32v192z"
      p-id="66303"
    ></path>
    <path
      d="M736 288m-192 0a192 192 0 1 0 384 0 192 192 0 1 0-384 0Z"
      p-id="66304"
    ></path>
  </svg>
);
const ManagementIcon = (props: Partial<GetProps<typeof Icon>>) => {
  return <Icon component={ManagementSvg} {...props} />;
};

export default ManagementIcon;
