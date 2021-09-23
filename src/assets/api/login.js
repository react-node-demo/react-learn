import request from "@/axios/login";

/**
 * @description 获取验证码
 * @param {*} params
 */
export const getVerificationCode = params => {
	return request({
		url: "/v1/getVerificationCode",
		method: "post",
		data: params
	});
};

/**
 * @description 用户注册
 * @param {*} params
 * @returns
 */
export const registerWithPassword = params => {
	return request({
		url: "/v1/registerWithPassword",
		method: "post",
		data: params
	});
};

/**
 * @description 用户名密码登录
 * @param {*} params
 * @returns
 */
export const loginWithPassword = params => {
	return request({
		url: "/v1/loginWithPassword",
		method: "post",
		data: params
	});
};
