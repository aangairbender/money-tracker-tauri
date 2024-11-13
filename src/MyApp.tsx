import { App, ConfigProvider, theme, ThemeConfig } from "antd";
import "./MyApp.css";
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Categories, Dashboard, Root, Transactions } from "@routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
    ],
  },
]);

const appTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  // token: {
  //   // Seed Token
  //   colorPrimary: "#00b96b",
  //   borderRadius: 2,

  //   // Alias Token
  //   colorBgContainer: "#f6ffed",
  // },
  components: {
    Layout: {
      triggerBg: "#358051",
      triggerColor: "#f6ffff",
    },
    Menu: {
      // itemBg: "#f5f5f5"
    }
  },
};

const MyApp: React.FC = () => (
  <ConfigProvider theme={appTheme}>
    <App>
      <RouterProvider router={router} />
    </App>
  </ConfigProvider>
);

export default MyApp;
