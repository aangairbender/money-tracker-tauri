import { Layout, Menu } from "antd";
import React, { useState } from "react";
import {
  FundOutlined,
  TagsOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { Link, Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

const items = [
  {
    key: "dashboard",
    icon: <FundOutlined style={{ fontSize: '16px' }}/>,
    label: <Link to={"/"}>Dashboard</Link>,
  },
  {
    key: "transactions",
    icon: <TransactionOutlined style={{ fontSize: '16px' }}/>,
    label: <Link to={"/transactions"}>Transactions</Link>,
  },
  {
    key: "categories",
    icon: <TagsOutlined style={{ fontSize: '16px' }}/>,
    label: <Link to={"/categories"}>Categories</Link>,
  },
];

export const Root: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ height: "100vh" }} hasSider>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(v) => setCollapsed(v)}
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
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
