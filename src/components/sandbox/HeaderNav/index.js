import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Dropdown, Avatar } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from "@ant-design/icons";
import { connect } from 'react-redux'
import { withRouter } from "react-router-dom";

import { clearUserInfo } from '@/redux/actions/user'

import './index.css';

const { Header } = Layout;

function HeaderNav(props) {
	const [userInfo, setUserInfo] = useState(props.userInfo);
	const [collapsed, setCollapsed] = useState(false);

	useEffect(() => {
		setUserInfo(props.userInfo)
	}, [props.userInfo])

	const changeCollapsed = () => {
		setCollapsed(!collapsed);
	};

	// 退出登录
	const logout = () => {
		props.clearUserInfo();

		props.history.replace({
			pathname: "/login"
		});
	};

	const menu = (
		<Menu>
			<Menu.Item key="1">超级管理员</Menu.Item>
			<Menu.Item danger key="2">
				<Button type="text" onClick={logout}>
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

export default connect(
	state => ({
		userInfo: state.UserReducer.userInfo
	}),
	{
		clearUserInfo: clearUserInfo
	}
)(withRouter(HeaderNav))
