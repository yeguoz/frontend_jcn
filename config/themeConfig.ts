import { theme } from "antd";

const themeConfig = {
  algorithm: [theme.compactAlgorithm],
  token: {
    colorPrimary: "#d77409",
    colorLink: "#d77409",
    colorBgBase: "#fafafa",
    borderRadius: 6,
    fontSize: 16,
  },
  components: {
    Notification: {
      width: "250px",
      algorithm: true,
    },
  }
};
export default themeConfig;