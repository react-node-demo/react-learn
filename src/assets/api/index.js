import request from "@/axios/index";

export const getUserInfo = params => {
	return request({
		url: `/v1/getUserInfo`,
		method: "get",
		data: params
	});
};
