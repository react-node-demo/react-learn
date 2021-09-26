import request from "@/axios/index";

export const getUserInfo = params => {
	return request({
		url: `/v1/getUserInfo`,
		method: "get",
		data: params
	});
};

export const getMenus = params => {
	return request({
		url: `/v1/getMenus`,
		method: "post",
		data: params
	});
};
