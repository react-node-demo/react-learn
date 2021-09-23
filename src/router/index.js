import React, { useEffect } from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";

import Login from "@/views/login/index";
import NewsSandBox from "@/views/sandbox/index";
import NotFound from "@/views/not-found/index";

export default function Router() {
	useEffect(() => {
		window.onpopstate = function (e: PopStateEvent) {
			const hash = window.location.hash;

			// 已登录禁止回到登录页
			if (localStorage.getItem("token") && hash.indexOf("login") !== -1) {
				let location = document.URL.split("#")[0];
				window.history.pushState(null, null, location);
			}
		};
		return () => {
			// 回退事件只用于当前组件，则需要在组件销毁时把回退事件销毁
			window.onpopstate = null;
		};
	}, []);
	return (
		<HashRouter>
			<Switch>
				<Route path="/login" component={props => <Login {...props}></Login>}></Route>
				<Route
					path="/"
					render={props =>
						// 未登录重定向到登录页
						localStorage.getItem("token") ? (
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
