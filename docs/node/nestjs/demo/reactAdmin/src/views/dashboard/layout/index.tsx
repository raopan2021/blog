import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { ConfigProvider, Layout, Menu, theme } from "antd";
import React, { useEffect, useState } from "react";

import zhCN from 'antd/locale/zh_CN';
import { useSelector } from "react-redux";
import { Outlet, To, useNavigate } from "react-router-dom";
import ThemeSwitch from "../../../components/themeSwitch";
import "./index.scss";

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
    return { key, icon, children, label } as MenuItem;
}

const items: MenuItem[] = [
    getItem("用户管理", "/user", <PieChartOutlined />),
    getItem("设备管理", "/device", <DesktopOutlined />),
];

const DashBoard: React.FC = () => {
    const themeColor = useSelector(state => state.theme.value)

    const [collapsed, setCollapsed] = useState(false);

    const navigate = useNavigate();
    useEffect(() => { navigate("/user") }, [navigate]);
    const menuItemClick = (e: { key: To; }): void => {
        navigate(e.key); // 路由跳转到e.key
    }

    useEffect(() => {
        console.log(themeColor)
    }, [themeColor])

    return (
        <ConfigProvider
            locale={zhCN}
            theme={{
                algorithm: themeColor === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
                components: {
                    Layout: {
                        siderBg: themeColor === "light" ? '#fff' : '#000',
                        headerBg: themeColor === "light" ? '#fff' : '#000',
                        triggerBg: themeColor === "light" ? '#fff' : '#000',
                        triggerColor: themeColor === "light" ? '#000' : '#fff',
                    }
                },
            }}
        >
            <Layout style={{ minHeight: "100vh" }}>
                <Sider
                    collapsible collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
                >
                    <div className="title">
                        <img src="vite.svg" alt="logo" />
                        {!collapsed && <span style={{ color: themeColor === "dark" ? "#fff" : "#000" }}>ReactAdmin</span>}
                    </div>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={["/user"]} defaultOpenKeys={["/user"]}
                        items={items} onClick={menuItemClick}
                    />
                    <footer className="footer">
                        <ThemeSwitch collapsed={collapsed} />
                    </footer>
                </Sider>
                <Layout>
                    <Content style={{ margin: "0 10px" }} >
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: "center" }}>
                        Ant Design ©{new Date().getFullYear()} Created by Raopan
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default DashBoard;
