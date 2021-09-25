const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MONGODB_LINK } = require("./config/config");

// 创建服务器应用程序
const app = express();

const register = require('./controller/register');
const refreshToken = require('./controller/refreshToken');
const login = require('./controller/login');
const getUserInfo = require('./controller/getUserInfo');

// 连接数据库，自动新建 ExpressAuth 库
mongoose.connect(MONGODB_LINK);

app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

//express 设置允许跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,X-File-Name,authorization,refresh-token");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Cache-Control", "no-store");
    if (req.method == 'OPTIONS') {
        res.sendStatus(200).end();
    } else {
        next();
    }
});

// 注册接口
app.use('/', register);
// 刷新token接口
app.use('/', refreshToken);
// 登录接口
app.use('/', login);
// 获取用户信息
app.use('/', getUserInfo);

app.listen(3001, () => {
	console.log("http://localhost:3001");
});
