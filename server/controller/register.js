const express = require("express");
// 创建服务器应用程序
const router = express.Router();

const UserMapper = require("../mapper/user");


router.post("/v1/registerWithPassword", async (request, response) => {
    const user = {
        nickname: request.body.nickname,
        telphone: request.body.telphone,
        password: request.body.password,
        identity: request.body.identity
    }

    UserMapper.insert(user).then((res) => {
        if (!res) {
            response.status(200).json({
                message: '手机号已被注册',
                code: 400,
                success: false
            })
        }

        if (res) {
            response.status(200).json({
                message: '注册成功',
                code: 200,
                success: false
            })
        }
    }).catch((err) => {
        response.status(500).json({
            message: err.toString(),
            success: false
        })
    })
});

module.exports = router;