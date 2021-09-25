const jwt = require("jsonwebtoken");
const { JWT_TOKEN_RULE, JWT_EXPIRES, REFRESH_JWT_EXPIRES } = require("../config/config"); // 从配置文件中引入 JWT_TOKEN_RULE，token 过期时间，refreshToken 过期时间
const { cacheUser } = require("./cacheUser"); // 用闭包缓存用户名

/**
 * 生成 token 和 initToken
 * @param {string} user
 */
const initToken = user => {
	return {
		token: jwt.sign(
			{
				id: user._id,
				nickname: user.nickname,
				telphone: user.telphone,
				identity: user.identity
			},
			JWT_TOKEN_RULE,
			{
				expiresIn: JWT_EXPIRES
			}
		),
		refresh_token: jwt.sign(
			{
				id: user._id
			},
			JWT_TOKEN_RULE,
			{
				expiresIn: REFRESH_JWT_EXPIRES
			}
		)
	};
};

/**
 * 验证 token/refreshToken
 * @param {string} token 格式为 `Beare ${token}`
 */
const validateToken = token => {
	return new Promise((resolve, reject) => {
		token = token.replace(/^Bearer /, "");

		let data = jwt.verify(token, JWT_TOKEN_RULE, (error, decoded) => {
			if (error) {
				if (error.name === "TokenExpiredError") {
					//token过期
					let json = {
						iat: 1,
						exp: 0,
						msg: "token过期",
						userInfo: jwt.decode(token)
					};
					return json;
				} else if (error.name === "JsonWebTokenError") {
					//无效的token
					let json = {
						iat: 1,
						exp: 0,
						msg: "无效的token",
						userInfo: jwt.decode(token)
					};
					return json;
				}
			} else {
				return decoded;
			}
		});

		console.log("data: ", data);

		// //开始时间小于结束时间，代表token还有效
		if (data.iat < data.exp) {
			cacheUser.setUserName(data.telphone);

			resolve(data);
		} else {
			reject(data);
		}
	});
};

const validateRefreshToken = refreshToken => {
	return new Promise((resolve, reject) => {
		let data = jwt.verify(refreshToken, JWT_TOKEN_RULE, (error, decoded) => {
			if (error) {
				if (error.name === "TokenExpiredError") {
					//token过期
					let json = {
						iat: 1,
						exp: 0,
						msg: "token过期",
						userInfo: jwt.decode(refreshToken)
					};
					return json;
				} else if (error.name === "JsonWebTokenError") {
					//无效的token
					let json = {
						iat: 1,
						exp: 0,
						msg: "无效的token",
						userInfo: jwt.decode(refreshToken)
					};
					return json;
				}
			} else {
				return decoded;
			}
		});

		console.log("refresh: ", data);

		//开始时间小于结束时间，代表token还有效
		if (data.iat < data.exp) {
			resolve(data);
		} else {
			reject(data);
		}
	});
};

module.exports = { initToken, validateToken, validateRefreshToken };
