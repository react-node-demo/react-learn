import React from "react";
import { Layout, Menu } from "antd";
import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";

import "./index.css";

const { Sider } = Layout;
const { SubMenu } = Menu;

const menus = [{
	title: '首页',
	path: '/home',
	icon: <AppstoreOutlined />
}, {
	title: '用户管理',
	path: '/user-manage',
	icon: <SettingOutlined />,
	children: [{
		title: '用户列表',
		path: '/user-manage/user/list',
		icon: null
	}]
}, {
	title: '权限管理',
	path: '/right-manage',
	icon: <SettingOutlined />,
	children: [{
		title: '角色列表',
		path: '/right-manage/role/list',
		icon: null
	},{
		title: '权限列表',
		path: '/right-manage/right/list',
		icon: null
	}]
}, {
	title: '图书管理',
	path: '/book-manage',
	icon: <SettingOutlined />,
	children: [{
		title: '图书列表',
		path: '/book-manage/book/list',
		icon: null
	}]
}]

function SideMenu(props) {
	const renderMenu = (menus) => {
		return menus.map((item) => item.children ? <SubMenu key={item.path} icon={item.icon} title={item.title}>
			{renderMenu(item.children)}
		</SubMenu> : <Menu.Item key={item.path} icon={item.icon} onClick={()=>toTarget(item.path)}>{item.title}</Menu.Item>)
	}

	const toTarget = (path) => {
		props.history.replace({
			pathname: path
		})
	}

	return (
		<Sider trigger={null} collapsible collapsed={false}>
			<div className="logo flex-center">学习园地</div>
			<Menu theme="dark" mode="inline" defaultSelectedKeys={menus[0].path}>
				{ renderMenu(menus) }
			</Menu>
		</Sider>
	);
}


export default withRouter(SideMenu);
