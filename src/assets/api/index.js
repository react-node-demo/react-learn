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

export const createMenu = params => {
	return request({
		url: `/v1/createMenu`,
		method: 'post',
		data: params
	})
}

export const updateMenu = params => {
	return request({
		url: `/v1/updateMenu`,
		method: 'patch',
		data: params
	})
}