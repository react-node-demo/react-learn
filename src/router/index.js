import React, { useEffect, useState } from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from 'react-redux'

import Login from "@/views/login/index";
import NewsSandBox from "@/views/sandbox/index";
import NotFound from "@/views/not-found/index";

function Router(props) {
	const [userInfo, setUserInfo] = useState(props.userInfo);

	useEffect(() => {
		setUserInfo(props.userInfo); // 需要useEffect进行数据同步，否则会出现redux数据变了，但此处的userInfo并没有改变，导致视图不更新
	}, [props.userInfo])

	useEffect(() => {
		window.onpopstate = function (e) {
			const hash = window.location.hash;

			// 已登录禁止回到登录页
			if (userInfo && userInfo.token && hash.indexOf("login") !== -1) {
				let location = document.URL.split("#")[0];
				window.history.pushState(null, null, location);
			}
		};

		return () => {
			// 回退事件只用于当前组件，则需要在组件销毁时把回退事件销毁
			window.onpopstate = null;
		};
	}, [userInfo]);

	return (
		<HashRouter>
			<Switch>
				<Route path="/login" component={props => <Login {...props}></Login>}></Route>
				<Route
					path="/"
					render={props =>
						// 未登录重定向到登录页
						userInfo && userInfo.token ? (
							<NewsSandBox {...props}></NewsSandBox>
						) : (
							<Redirect to="/login"></Redirect>
						)
					}
				></Route>

				<Route path="*" component={props => <NotFound {...props}></NotFound>}></Route>
			</Switch>
		</HashRouter>
	);
}

export default connect(
	state=>({
		userInfo: state.UserReducer.userInfo
	})
)(Router)
