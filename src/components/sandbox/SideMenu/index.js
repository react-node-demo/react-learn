import React from "react";
import { Layout, Menu } from "antd";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";

import "./index.css";

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function SideMenu() {
	return (
		<Sider trigger={null} collapsible collapsed={false}>
			<div className="logo flex-center">学习园地</div>
			<Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
				<Menu.Item key="1" icon={<AppstoreOutlined />}>
					<span>主页</span>
				</Menu.Item>
				<SubMenu key="sub1" icon={<SettingOutlined />} title="用户管理">
					<Menu.Item key="2">
						<span>用户列表</span>
					</Menu.Item>
				</SubMenu>
				<SubMenu key="sub2" icon={<SettingOutlined />} title="权限管理">
					<Menu.Item key="3">
						<span>权限列表</span>
					</Menu.Item>
				</SubMenu>
			</Menu>
		</Sider>
	);
}
