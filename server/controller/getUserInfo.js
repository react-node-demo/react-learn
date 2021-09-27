const express = require("express");
const router = express.Router();

const UserMapper = require('../mapper/user');

const { validateToken } = require("../common/jwt");

router.get("/v1/getUserInfo", (request, response) => {
    const {
		headers: { authorization }
	} = request;

    validateToken(authorization)
			.then(data => {
                UserMapper.queryById(data).then((user) => {
                    user = {
                        id: user._id,
                        nickname: user.nickname,
                        telphone: user.telphone,
                        identity: user.identity,
                    }
                    
                    if (user) {
                        response.status(200).json({
                            body: {
                                userInfo: user
                            },
                            message: "获取成功",
                            code: 200,
                            success: true
                        })
                    }
                }).catch((err) => {
                    response.status(200).json({
                        message: err.toString(),
                        code: 500,
                        success: false
                    })
                })
			})
			.catch(exception => {
                response.status(200).json({
                    message: exception.message.toString(),
                    code: 401,
                    success: false
                })
			});
});

module.exports = router;