import axios from "axios";
import { refreshToken } from "@/assets/api/login";
import { message } from "antd";

// 是否正在刷新的标记
let isRefreshing = false

// 重试队列，每一项将是一个待执行的函数形式
let retryRequests = []

const service = axios.create({
	baseURL: "http://localhost:3001",
	timeout: 5000
});

service.interceptors.request.use(
	async config => {
		if (localStorage.getItem("token")) {
			config.headers["refresh-token"] = localStorage.getItem("token");
			config.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
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
		const { data, config } = response;

		switch (data.code) {
			case 401:
				if (!isRefreshing) {
					isRefreshing = true;
					
					return refreshToken(localStorage.getItem("refresh_token")).then((res) => {
						let data = res.data;

						if (data.success) {
							const { token, refresh_token, expiresTime } = data.body;
							
							localStorage.setItem("token", token);
							localStorage.setItem("refresh_token", refresh_token);
							localStorage.setItem("expiresTime", expiresTime + new Date().getTime());

							//遍历缓存队列 发起请求 传入最新token
							retryRequests.forEach((cb) => cb(token, refresh_token));
							// 重试完清空这个队列
							retryRequests = [];

							return service(config);
						} else {
							localStorage.removeItem("token");
							localStorage.removeItem("refresh_token");
							localStorage.removeItem("expiresTime");

							window.location.reload();
						}
					}).catch((err) => {
						console.log("异常：", err)
						localStorage.removeItem("token");
						localStorage.removeItem("refresh_token");
						localStorage.removeItem("expiresTime");

						window.location.reload();
					}).finally(() => {
						isRefreshing = false;
					})
				} else {
					return new Promise((resolve) => {
						// 将resolve放进队列，用一个函数形式来保存，等token刷新后调用执行
						retryRequests.push((token, refresh_token) => {
							config.headers['refresh-token'] = refresh_token;
							config.headers['Authorization'] = `Bearer ${token}`;
							resolve(service(config));
						});
					});
				}
				break;
		}
		
		return response; // 这边必须返回返回值，否则promise请求拿到的数据为undefined
	},
	error => {
		return Promise.reject(error);
	}
);

export default service;
