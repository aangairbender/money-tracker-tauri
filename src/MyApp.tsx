import { App, ConfigProvider } from "antd";
import "./MyApp.css";
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "@routes/Root";
import Transactions from "@routes/Transactions";
import Dashboard from "@routes/Dashboard";
import Categories from "@routes/Categories";

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

const MyApp: React.FC = () => (
  <ConfigProvider
    theme={{
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
          itemBg: "#f5f5f5"
        }
      },
    }}
  >
    <App>
      <RouterProvider router={router} />
    </App>
  </ConfigProvider>
);

export default MyApp;
