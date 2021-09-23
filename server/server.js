const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MONGODB_LINK } = require("./config/config");
const { initToken, validateToken } = require("./common/jwt");

// 引入User模型
const User = require("./model/user");
const resolve = require("resolve");
// 创建服务器应用程序
const app = express();

// 连接数据库，自动新建 ExpressAuth 库
mongoose.connect(MONGODB_LINK);

app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

app.use((req, res, next) => {
	//判断路径
	if (req.path !== "/" && !req.path.includes(".")) {
		res.set({
			"Access-Control-Allow-Credentials": true, //允许后端发送cookie
			"Access-Control-Allow-Origin": req.headers.origin || "*", //任意域名都可以访问,或者基于我请求头里面的域
			"Access-Control-Allow-Headers": "X-Requested-With,Content-Type,Access-Token,Authorization", //设置请求头格式和类型
			"Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS", //允许支持的请求方式
			"Content-Type": "application/json; charset=utf-8" //默认与允许的文本格式json和编码格式
		});
	}
	req.method === "OPTIONS" ? res.status(204).end() : next();
});

// 检查是否登录中间件方法
const checkLogin = async (request, response) => {
	const {
		headers: { authorization }
	} = request;

	return new Promise((resolve, reject) => {
		validateToken(authorization).then((data) => {
			resolve(data);
		}).catch((exception) => {
			reject(exception);
		})
	})
};

// 注册接口
app.post("/v1/registerWithPassword", async (request, response) => {
	try {
		const user = await User.create({
			nickname: request.body.nickname,
			telphone: request.body.telphone,
			password: request.body.password,
			identity: request.body.identity
		});

		if (response.statusCode && user) {
			response.send({
				status: response.statusCode,
				message: "注册成功",
				success: true
			});
		}
	} catch (exception) {
		console.log("exception: ", exception);
		response.send({
			status: response.statusCode,
			message: "注册失败",
			success: false
		});
	}
});

// 登录接口
app.post("/v1/loginWithPassword", async (request, response) => {
	const user = await User.findOne({
		telphone: request.body.telphone
	});

	if (!user) {
		return response.json({
			message: "用户不存在",
			status: response.statusCode,
			success: false
		});
	}

	console.log("user: ", user, request.body.password);

	User.comparePassword(request.body.password, user.password)
		.then(match => {
			if (match) {
				return response.json({
					message: "登录成功",
					status: response.statusCode,
					body: initToken(user),
					success: true
				});
			} else {
				return response.json({
					message: "密码错误",
					status: response.statusCode,
					success: false
				});
			}
		})
		.catch(err => {
			return response.json({
				message: err,
				status: response.statusCode,
				success: false
			});
		});
});

app.use("/v1/getUserInfo", (request, response) => {
	checkLogin(request, response).then(async (token) => {
		const { id } = token;
		const user = await User.findOne({
			_id: id
		});

		console.log("user: ", user)

		if (!user) {
			return response.json({
				body: {
					userInfo: null
				},
				message: "获取用户信息失败",
				status: 500,
				success: false
			})
		}

		return response.json({
			body: {
				userInfo: user
			},
			message: '获取成功',
			status: response.statusCode,
			success: true
		})
	});
});

app.listen(3001, () => {
	console.log("http://localhost:3001");
});
