import React from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";

import SideMenu from "@/components/sandbox/SideMenu/index";
import HeaderNav from "@/components/sandbox/HeaderNav/index";

import Home from "@/views/sandbox/home/index";
import UserList from "@/views/sandbox/system-manage/user-list/index";
import RoleList from "@/views/sandbox/system-manage/role-list/index";
import RightList from "@/views/sandbox/system-manage/right-list/index";
import MenuList from "@/views/sandbox/system-manage/menu-list";
import BookList from "@/views/sandbox/book-manage/book-list";

import "./index.css";

const { Content } = Layout;

export default function NewsSandBox(props) {
	return (
		<Layout>
			<SideMenu></SideMenu>

			<Layout className="site-layout">
				<HeaderNav></HeaderNav>

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
							path="/system-manage/user/list"
							component={props => <UserList {...props}></UserList>}
						></Route>
						<Route
							path="/system-manage/role/list"
							component={props => <RoleList {...props}></RoleList>}
						></Route>
						<Route path="/system-manage/menu/list" component={props => <MenuList {...props}></MenuList>}></Route>
						<Route
							path="/system-manage/right/list"
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
