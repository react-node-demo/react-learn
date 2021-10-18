const express = require("express");
const router = express.Router();

const UserMapper = require('../mapper/user');

const { validateToken } = require("../common/jwt");
const { request, response } = require("express");

function checkToken(request) {
	const {
		headers: { authorization }
	} = request;

	return new Promise((resolve, reject) => {
		validateToken(authorization)
			.then(res => {
				resolve();
			})
			.catch(exception => {
				reject(exception);
			});
	});
}

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

router.get("/v1/getUsers", (request, response) => {
    checkToken(request, response)
		.then(() => {
                UserMapper.queryUsers().then((users) => {
                    users = users.map((item) => {
                        return {
                            id: item._id,
                            nickname: item.nickname,
                            telphone: item.telphone,
                            identity: item.identity,
							password: item.password
                        }
                    })
                    
                    if (users.length) {
                        response.status(200).json({
                            body: {
                                users: users
                            },
                            message: "获取成功",
                            code: 200,
                            success: true
                        })
                    }
                }).catch((err) => {
                    response.status(200).json({
                        body: null,
                        message: err.toString(),
                        code: 500,
                        success: false
                    })
                })
			})
			.catch(exception => {
                response.status(200).json({
                    body: null,
                    message: exception.message.toString(),
                    code: 401,
                    success: false
                })
			});
})

router.delete("/v1/deleteUser", (request, response) => {
	console.log("delete: ", request.body)
    checkToken(request)
		.then(() => {
			UserMapper.delete(request.body)
				.then(res => {
					if (res) {
						response.status(200).json({
							message: "删除成功",
							code: 200,
							success: true
						});
					}
				})
				.catch(err => {
					response.status(200).json({
						body: null,
						message: err.toString(),
						code: 400,
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
})

router.patch("/v1/updateUser", (request, response) => {
    let user = {
		id: request.body.id
	};

	if (request.body.nickname) {
		user.nickname = request.body.nickname;
	}

    if (request.body.telphone) {
		user.telphone = request.body.telphone;
	}

    if (request.body.telphone) {
		user.telphone = request.body.telphone;
	}

    if (request.body.identity) {
		user.identity = request.body.identity;
	}

	if (request.body.visible !== undefined) {
		menu.visible = Number(request.body.visible);
	}

	if (request.body.disabled !== undefined) {
		menu.disabled = Number(request.body.disabled);
	}

    checkToken(request)
    .then(() => {
        UserMapper.update(user)
            .then(res => {
                if (res) {
                    response.status(200).json({
                        message: "更新成功",
                        code: 200,
                        success: true
                    });
                }
            })
            .catch(err => {
                response.status(200).json({
                    message: err.toString(),
                    code: 400,
                    success: false
                });
            });
    })
    .catch(exception => {
        response.status(200).json({
            message: exception.message.toString(),
            code: 401,
            success: false
        });
    });
})

router.post("/v1/createUser", (request, response) => {
    let user = {};

	if (request.body.nickname) {
		user.nickname = request.body.nickname;
	}

    if (request.body.telphone) {
		user.telphone = request.body.telphone;
	}

	if (request.body.password) {
		user.password = request.body.password;
	}

    if (request.body.identity) {
		user.identity = request.body.identity;
	}

	if (request.body.disabled !== undefined) {
		menu.disabled = Number(request.body.disabled);
	}

    checkToken(request)
		.then(() => {
			UserMapper.insert(user)
				.then(res => {
					if (res) {
						response.status(200).json({
							message: "添加成功",
							code: 200,
							success: true
						});
					} else {
						response.status(200).json({
							message: "用户已存在",
							code: 400,
							success: false
						});
					}
				})
				.catch(err => {
					response.status(200).json({
						message: err.toString(),
						code: 500,
						success: false
					});
				});
		})
		.catch(exception => {
			response.status(200).json({
				message: exception.message.toString(),
				code: 401,
				success: false
			});
		});
})

module.exports = router;