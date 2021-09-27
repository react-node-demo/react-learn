import axios from "axios";
import { refreshToken } from "@/assets/api/login";
import { message } from "antd";

const service = axios.create({
	baseURL: "http://localhost:3001",
	timeout: 5000
});

service.interceptors.request.use(
	async config => {
		if (localStorage.getItem("token")) {
			let expriredTime = localStorage.getItem("expiresTime");
			let currentTime = Date.now();
			let diffTime = expriredTime - currentTime;
			let refreshData = null;

			if (diffTime && diffTime < 10) {
				refreshData = await refreshToken(localStorage.getItem("refresh_token"));

				let data = refreshData.data;

				if (data.success) {
					const { token, refresh_token, expiresTime } = data.body;
					localStorage.setItem("token", token);
					localStorage.setItem("refresh_token", refresh_token);
					localStorage.setItem("expiresTime", expiresTime + new Date().getTime());
				} else {
					localStorage.removeItem("token");
					localStorage.removeItem("refresh_token");
					localStorage.removeItem("expiresTime");

					window.location.reload();
				}
			}

			config.headers["refresh-token"] = localStorage.getItem("refresh_token");
			config.headers["Authorization"] = "Bearer " + localStorage.getItem("token");
		}

		return config;
	},
	error => {
		message.error(error, 3000);
		Promise.reject(error);
	}
);

service.interceptors.response.use(
	response => {
		console.log("axios: ", response);
		const { data } = response;

		switch (data.status) {
			case 401:
		}
		return response; // 这边必须返回返回值，否则promise请求拿到的数据为undefined
	},
	error => {
		console.log(error);
	}
);

export default service;
