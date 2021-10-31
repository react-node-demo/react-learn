import axios from "axios";

import { refreshToken } from "@/assets/api/login";
import store from "../redux/store";

// 是否正在刷新的标记
let isRefreshing = false;

// 重试队列，每一项将是一个待执行的函数形式
let retryRequests = [];

const service = axios.create({
	baseURL: "http://localhost:3001",
	timeout: 5000
});

service.interceptors.request.use(
	async config => {
		const { userInfo } = store.getState().UserReducer;

		if (userInfo && userInfo.refresh_token) {
			config.headers["refresh-token"] = userInfo.refresh_token;
			config.headers["Authorization"] = "Bearer " + userInfo.token;
		}

		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

service.interceptors.response.use(
	response => {
		console.log("axios: ", response.data);
		const { userInfo } = store.getState().UserReducer;
		const { data, config } = response;

		switch (data.code) {
			case 401:
				if (!isRefreshing) {
					isRefreshing = true;

					return refreshToken(userInfo.refresh_token)
						.then(res => {
							let data = res.data;

							if (data.success) {
								const { token, refresh_token, expiresTime } = data.body;

								store.dispatch({ 
									type: 'update_userInfo', 
									payload: {
										token: token,
										refresh_token: refresh_token,
										expiresTime: expiresTime
									} 
								})

								//遍历缓存队列 发起请求 传入最新token
								retryRequests.forEach(cb => cb(token, refresh_token));
								// 重试完清空这个队列
								retryRequests = [];

								return service(config);
							} else {
								store.dispatch({
									type: 'clear_userInfo'
								})

								window.location.reload();
							}
						})
						.catch(err => {
							// 由于存在并发请求多次刷新token的情况，所以异常不退出退出
							console.log("异常：", err);
						})
						.finally(() => {
							isRefreshing = false;
						});
				} else {
					return new Promise(resolve => {
						// 将resolve放进队列，用一个函数形式来保存，等token刷新后调用执行
						retryRequests.push((token, refresh_token) => {
							config.headers["refresh-token"] = refresh_token;
							config.headers["Authorization"] = `Bearer ${token}`;
							resolve(service(config));
						});
					});
				}
			default:
				break;
		}

		return response; // 这边必须返回返回值，否则promise请求拿到的数据为undefined
	},
	error => {
		return Promise.reject(error);
	}
);

export default service;
