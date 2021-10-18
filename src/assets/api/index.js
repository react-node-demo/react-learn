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
		method: "post",
		data: params
	});
};

export const updateMenu = params => {
	return request({
		url: `/v1/updateMenu`,
		method: "patch",
		data: params
	});
};

export const deleteMenu = params => {
	return request({
		url: `/v1/deleteMenu`,
		method: "delete",
		data: params
	});
};

export const getUsers = () => {
	return request({
		url: `/v1/getUsers`,
		method: "get"
	});
}

export const deleteUser = () => {
	return request({
		url: `/v1/deleteUser`,
		method: "delete"
	});
}

export const updateUser = (params) => {
	return request({
		url: `/v1/updateUser`,
		method: "patch",
		data: params
	});
}

export const createUser = (params) => {
	return request({
		url: `/v1/createUser`,
		method: "post",
		data: params
	});
}
