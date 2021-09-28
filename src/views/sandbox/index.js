import React, { useState, useEffect } from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";

import SideMenu from "@/components/sandbox/SideMenu/index";
import HeaderNav from "@/components/sandbox/HeaderNav/index";

import Home from "@/views/sandbox/home/index";
import UserList from "@/views/sandbox/user-manage/user-list/index";
import RoleList from "@/views/sandbox/right-manage/role-list/index";
import RightList from "@/views/sandbox/right-manage/right-list/index";
import BookList from "@/views/sandbox/book-manage/book-list";
import MenuList from "@/views/sandbox/right-manage/menu-list";

import { getUserInfo, getMenus } from "@/assets/api/index";
import { generateMenuTree } from '@/assets/utils/index';

import "./index.css";

const { Content } = Layout;

export default function NewsSandBox(props) {
	const [userInfo, setUserInfo] = useState(null);
	const [menus, setMenus] = useState([]);

	useEffect(() => {
		getUserInfo().then(res => {
			let data = res.data;

			console.log(data);

			if (data.success) {
				let result = data.body;

				setUserInfo(result.userInfo);
			}
		});
	}, []);

	useEffect(() => {
		getMenus().then(res => {
			let data = res.data;
			if (data.success) {
				const { menus } = data.body;

				setMenus(generateMenuTree(menus));
			}
			console.log("res: ", res)
		});
	}, []);

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("expiresTime");

		props.history.replace({
			pathname: "/login"
		});
	};

	return (
		<Layout>
			<SideMenu menus={menus}></SideMenu>

			<Layout className="site-layout">
				<HeaderNav userInfo={userInfo} logout={logout}></HeaderNav>

				<Content
					className="site-layout-background"
					style={{
						margin: "24px 16px",
						padding: 24,
						minHeight: 280
					}}
				>
					<Switch>
						<Route path="/home" component={props => <Home {...props}></Home>}></Route>
						<Route
							path="/user-manage/user/list"
							component={props => <UserList {...props}></UserList>}
						></Route>
						<Route
							path="/right-manage/role/list"
							component={props => <RoleList {...props}></RoleList>}
						></Route>
						<Route path="/right-manage/menu/list" component={props => <MenuList {...props}></MenuList>}></Route>
						<Route
							path="/right-manage/right/list"
							component={props => <RightList {...props}></RightList>}
						></Route>
						<Route
							path="/book-manage/book/list"
							component={props => <BookList {...props}></BookList>}
						></Route>

						<Redirect from="/" to="/home" exact></Redirect>
					</Switch>
				</Content>
			</Layout>
		</Layout>
	);
}
