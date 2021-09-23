import React, { useState, useEffect } from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";

import SideMenu from "@/components/sandbox/SideMenu/index";
import HeaderNav from "@/components/sandbox/HeaderNav/index";

import Home from "@/views/sandbox/home/index";
import UserList from "@/views/sandbox/user-manage/user-list/index";
import RoleList from "@/views/sandbox/right-manage/role-list/index";

import { getUserInfo } from "@/assets/api/index";

import "./index.css";

const { Content } = Layout;

export default function NewsSandBox(props) {
	const [userInfo, setUserInfo] = useState(null);

	useEffect(() => {
		getUserInfo().then(res => {
			let data = res.data;

			console.log(data)

			if (data.success) {
				let result = data.body;

				setUserInfo(result.userInfo);
			}
		});
	}, []);

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("refresh_token");

		props.history.replace({
			pathname: "/login"
		});
	};

	return (
		<Layout>
			<SideMenu></SideMenu>

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
							path="/user-manage/userlist"
							component={props => <UserList {...props}></UserList>}
						></Route>
						<Route
							path="/right-manage/rolelist"
							component={props => <RoleList {...props}></RoleList>}
						></Route>

						<Redirect from="/" to="/home" exact></Redirect>
					</Switch>
				</Content>
			</Layout>
		</Layout>
	);
}
