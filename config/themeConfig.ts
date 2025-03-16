import { theme } from "antd";

const themeConfig = {
  algorithm: [theme.compactAlgorithm],
  token: {
    colorBgBase: "#fafafa",
    fontSize: 16,
  }
};

const lightTheme = {
  ...themeConfig,
  token: {
    ...themeConfig.token,
    colorPrimary: "#C45100",
    colorLink: "#C45100",
  },
  components: {
    Notification: {
      width: 250,
      algorithm: true,
      colorBgBase: "#fff",
    },
    Button: {
      defaultHoverBg: "#fff"
    },
    Menu: {
      itemHeight: 45,
      iconSize: 16,
      subMenuItemBg: "#fff",
      itemSelectedBg: "#fff",
      iconMarginInlineEnd: 15,
    },
    Table: {
      headerBg: "#fafafa",
      cellPaddingBlock: 10,
      headerSortActiveBg: "#fafafa",
      headerSplitColor: "none"
    }
  }
};

export { lightTheme };