import { Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import {
  FundOutlined,
  ImportOutlined,
  TagsOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

const items = [
  {
    key: "dashboard",
    icon: React.createElement(FundOutlined),
    label: <Link to={"/dashboard"}>Dashboard</Link>,
  },
  {
    key: "transactions",
    icon: React.createElement(TransactionOutlined),
    label: <Link to={"/transactions"}>Transactions</Link>,
  },
  {
    key: "categories",
    icon: React.createElement(TagsOutlined),
    label: <Link to={"/categories"}>Categories</Link>,
  },
  {
    key: "import",
    icon: React.createElement(ImportOutlined),
    label: <Link to={"/import"}>Import</Link>,
  },
];

const Root: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ height: "100vh" }} hasSider>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(v) => setCollapsed(v)}
        style={{ background: colorBgContainer }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          mode="inline"
          defaultSelectedKeys={["dashboard"]}
          items={items}
          style={{ height: "100%" }}
        />
      </Sider>
      <Layout>
        <Content
          style={{
            padding: 24,
            margin: 0,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Root;
