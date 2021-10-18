const express = require("express");
const router = express.Router();
const UserMapper = require("../mapper/user");
const User = require("../model/user");

const { JWT_EXPIRES } = require("../config/config");
const { initToken } = require("../common/jwt");

router.post("/v1/loginWithPassword", async (request, response) => {
	UserMapper.queryByTelphone(request.body).then(user => {
		User.comparePassword(request.body.password, user.password)
			.then(match => {
				if (match) {
					return response.status(200).json({
						message: "登录成功",
						status: 200,
						body: {
							token: initToken(user).token,
							refresh_token: initToken(user).refresh_token,
							expiresTime: JWT_EXPIRES
						},
						success: true
					});
				} else {
					return response.status(200).json({
						message: "密码错误",
						status: 400,
						success: false
					});
				}
			})
			.catch(err => {
				response.status(200).json({
					body: null,
					message: err.toString(),
					status: 500,
					success: false
				});
			});
	}).catch((exception) => {
		response.status(200).json({
			body: null,
			message: exception.message.toString(),
			code: 500,
			success: false
		})
	});
});

module.exports = router;
