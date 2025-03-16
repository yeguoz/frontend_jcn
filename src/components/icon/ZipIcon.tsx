import Icon from "@ant-design/icons";
import { type GetProps } from "antd";

const ForgetSvg = () => (
  <svg
    width="1rem"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="9372"
  >
    <path
      d="M640 64a32 32 0 0 1 22.624 9.376L877.28 288H928a32 32 0 0 1 32 32v416a32 32 0 0 1-32 32h-32v160a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32v-160H96a32 32 0 0 1-32-32V320a32 32 0 0 1 32-32h32V96a32 32 0 0 1 32-32h480z m192 704H192v128h640v-128z m64-416H128v352h768V352z m-528 48v77.248L253.248 592H368v64h-192v-77.248L290.72 464H176v-64h192z m224 0v64H544v128h48v64h-160v-64H480v-128h-48v-64h160z m220.8 0a35.2 35.2 0 0 1 35.2 35.2v121.6a35.2 35.2 0 0 1-35.2 35.2h-92.8v64h-64v-256h156.8z m-28.8 64h-64v64h64v-64zM626.72 128H192v160h594.72l-160-160z"
      p-id="13316"
    ></path>
  </svg>
);
const ZipIcon = (props: Partial<GetProps<typeof Icon>>) => {
  return <Icon component={ForgetSvg} {...props} />;
};
export default ZipIcon;
