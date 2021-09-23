import React, { useState } from "react";
import { Layout, Menu, Button, Dropdown, Avatar } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from "@ant-design/icons";

import './index.css';

const { Header } = Layout;

export default function HeaderNav(props) {
	const [collapsed, setCollapsed] = useState(false);

	const { userInfo } = props;

	const changeCollapsed = () => {
		setCollapsed(!collapsed);
	};

	const menu = (
		<Menu>
			<Menu.Item key="1">超级管理员</Menu.Item>
			<Menu.Item danger key="2">
				<Button type="text" onClick={props.logout}>
					退出登录
				</Button>
			</Menu.Item>
		</Menu>
	);

	console.log("userInfo: ", props);

	return (
		<Header className="site-layout-background" style={{ padding: "0 16px" }}>
			<div className="avatar">
					{
						userInfo ? 
						<>欢迎{userInfo.nickname}登录</> : null
					}
					<Dropdown overlay={menu}>
						<Avatar size="large" icon={<UserOutlined />} />
					</Dropdown>
				</div>
			{collapsed ? (
				<MenuUnfoldOutlined onClick={changeCollapsed} />
			) : (
				<MenuFoldOutlined onClick={changeCollapsed} />
			)}
		</Header>
	);
}
