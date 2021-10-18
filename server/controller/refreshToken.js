const express = require("express");
const router = express.Router();

const UserMapper = require("../mapper/user");

const { JWT_EXPIRES } = require("../config/config");
const { initToken, validateRefreshToken } = require("../common/jwt");

router.get("/v1/refreshToken/:refreshToken", (request, response) => {
	validateRefreshToken(request.params.refreshToken)
		.then(data => {
			UserMapper.queryById(data)
				.then(user => {
					if (user) {
						response.status(200).json({
							message: "获取成功",
							code: 200,
							body: {
								token: initToken(user).token,
								refresh_token: initToken(user).refresh_token,
								expiresTime: JWT_EXPIRES
							},
							success: true
						});
					}
				})
				.catch(err => {
					console.log("err: ", err)
					response.status(200).json({
						body: null,
						message: "用户信息获取失败",
						code: 401,
						success: false
					});
				});
		})
		.catch(exception => {
			response.status(200).json({
				body: null,
				message: exception.message.toString(),
				code: 401,
				success: false
			});
		});
});

module.exports = router;
