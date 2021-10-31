import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux'

import { updateMenus } from '@/redux/actions/menus'

import { getMenus } from "@/assets/api/index";
import { generateMenuTree } from '@/assets/utils/index';

import "./index.css";

const { Sider } = Layout;
const { SubMenu } = Menu;

function SideMenu(props) {
	const [menus, setMenus] = useState(props.menus);
	
	useEffect(() => {
		setMenus(generateMenuTree(props.menus))
	}, [props.menus])
	
	useEffect(() => {
		getMenus().then(res => {
			let data = res.data;
			if (data.success) {
				const { menus } = data.body;

				props.updateMenus(menus);
				setMenus(generateMenuTree(menus));
			}
		});
	}, []);

	const renderMenu = (menus) => {
		return menus.map((item) => item.children ? <SubMenu key={item.url} title={item.title}>
			{ renderMenu(item.children) }
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


export default connect(
	state => ({
		menus: state.MenusReducer.menus
	}),
	{
		updateMenus: updateMenus
	}
)(withRouter(SideMenu));
