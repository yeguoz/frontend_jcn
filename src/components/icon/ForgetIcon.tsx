import Icon from "@ant-design/icons";
import { theme, type GetProps } from "antd";

const { useToken } = theme;
let color = "";
const ForgetSvg = () => (
  <svg
    fill={color}
    width="1.7rem"
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="9372"
  >
    <path
      d="M761.23 459.69l-143.4-82.79 63.82-110.54 143.4 82.79c19.8 11.43 45.11 4.65 56.54-15.15s4.65-45.11-15.15-56.54l-143.4-82.79 39.67-68.7c11.43-19.8 4.65-45.12-15.15-56.55s-45.12-4.65-56.55 15.15l-250.34 433.6c-101.39-35.98-217.47 4.14-273.17 100.61-62.76 108.7-25.37 248.23 83.34 310.99s248.23 25.38 310.99-83.32c55.7-96.47 32.4-217.06-49.46-286.88l64.07-110.97 143.4 82.79c19.8 11.43 45.11 4.65 56.54-15.16 11.43-19.8 4.65-45.11-15.15-56.54zM490.14 805.05c-39.93 69.17-128.73 92.96-197.9 53.03-69.19-39.95-92.97-128.74-53.03-197.9 39.94-69.17 128.72-92.98 197.91-53.03 69.16 39.92 92.95 128.72 53.02 197.9z m0 0"
      p-id="11241"
    ></path>
  </svg>
);
const ForgetIcon = (props: Partial<GetProps<typeof Icon>>) => {
  const { token } = useToken();
  color = token.colorPrimary;
  return <Icon component={ForgetSvg} {...props} />;
};
export default ForgetIcon;
