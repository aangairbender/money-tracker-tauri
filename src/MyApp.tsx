import { App, ConfigProvider } from "antd";
import "./MyApp.css";
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "@routes/Root";
import Transactions from "@routes/Transactions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "transactions",
        element: <Transactions />
      }
    ]
  }
]);

const MyApp: React.FC = () => (
  <ConfigProvider
    theme={{
      token: {
        // Seed Token
        colorPrimary: '#00b96b',
        borderRadius: 2,

        // Alias Token
        colorBgContainer: '#f6ffed',
      },
    }}
  >
    <App>
      <RouterProvider router={router} />
    </App>
  </ConfigProvider>
);

export default MyApp;
