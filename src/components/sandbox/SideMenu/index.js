import React from "react";
import { Layout, Menu } from "antd";
import { withRouter } from "react-router-dom";

import "./index.css";

const { Sider } = Layout;
const { SubMenu } = Menu;

function SideMenu(props) {
	const { menus } = props;

	const renderMenu = (menus) => {
		return menus.map((item) => item.children ? <SubMenu key={item.url} title={item.title}>
			{renderMenu(item.children)}
		</SubMenu> : <Menu.Item key={item.url} onClick={()=>toTarget(item.url)}>{item.title}</Menu.Item>)
	}

	const toTarget = (path) => {
		props.history.replace({
			pathname: path
		})
	}

	return (
		<Sider trigger={null} collapsible collapsed={false}>
			<div className="logo flex-center">学习园地</div>
			{
				menus.length ? (
					<Menu theme="dark" mode="inline" defaultSelectedKeys={menus[0].url}>
						{ renderMenu(menus) }
					</Menu>
				) : null
			}
		</Sider>
	);
}


export default withRouter(SideMenu);
