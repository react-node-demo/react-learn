const jwt = require("jsonwebtoken");
const resolve = require("resolve");
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
				id: user._id,
				nickname: user.nickname,
				telphone: user.telphone,
				identity: user.identity
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
const validateToken = (token, type) => {
	return new Promise((resolve, reject) => {
		try {
			token = token.replace(/^Bearer /, "");
			const data = jwt.verify(token, JWT_TOKEN_RULE);
			if (type !== "refreshToken") {
				// 如果是 token 且 token 生效，缓存 token
				cacheUser.setUserName(data.telphone);
			}
			resolve(data)
		} catch (e) {
			reject(e);
		}
	})
};

module.exports = { initToken, validateToken };
