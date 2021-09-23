import axios from "axios";
import { message } from "antd";

const service = axios.create({
	baseURL: "http://localhost:3001",
	timeout: 5000
});

service.interceptors.request.use(
	config => {
		return config;
	},
	error => {
		message.error(error, 3000);
		Promise.reject(error);
	}
);

service.interceptors.response.use(response => {
	return response; // 这边必须返回返回值，否则promise请求拿到的数据为undefined
});

export default service;
