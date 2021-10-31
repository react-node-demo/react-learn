const express = require("express");
const router = express.Router();

const MenuMapper = require("../mapper/menu");
const RoleMenuMapper = require("../mapper/role-menu");

const { validateToken } = require("../common/jwt");

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

router.post("/v1/getMenus", async (request, response) => {
	checkToken(request, response)
		.then(() => {
			MenuMapper.queryAll()
				.then(menus => {
					menus = menus.map(item => {
						return {
							id: item._id.toString(),
							title: item.title,
							url: item.url,
							parentId: item.parent_id,
							icon: item.icon,
							component: item.component,
							visible: item.visible,
							disabled: item.disabled
						};
					});

					response.status(200).json({
						message: "获取成功",
						code: 200,
						body: {
							menus: menus
						},
						success: true
					});
				})
				.catch(err => {
					response.status(200).json({
						body: {},
						message: err.toString(),
						code: 401,
						success: false
					});
				});
		})
		.catch(exception => {
			response.status(200).json({
				body: {},
				message: exception.message.toString(),
				code: 401,
				success: false
			});
		});
});

router.post("/v1/createMenu", async (request, response) => {
	const menu = {
		parent_id: request.body.parentId,
		title: request.body.name,
		url: request.body.path,
		component: request.body.component,
		icon: request.body.icon,
		visible: request.body.visible,
		disabled: request.body.disabled
	};

	checkToken(request)
		.then(() => {
			MenuMapper.insert(menu)
				.then(res => {
					if (res) {
						response.status(200).json({
							message: "添加成功",
							code: 200,
							success: true
						});
					} else {
						response.status(200).json({
							message: "菜单已存在",
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
});

router.patch("/v1/updateMenu", async (request, response) => {
	let menu = {
		id: request.body.id
	};

	if (request.body.parentId) {
		menu.parent_id = request.body.parentId;
	}

	if (request.body.name) {
		menu.title = request.body.name;
	}

	if (request.body.path) {
		menu.url = request.body.path;
	}

	if (request.body.component) {
		menu.component = request.body.component;
	}

	if (request.body.icon) {
		menu.icon = request.body.icon;
	}

	if (request.body.visible !== undefined) {
		menu.visible = Number(request.body.visible);
	}

	if (request.body.disabled !== undefined) {
		menu.disabled = Number(request.body.disabled);
	}

	checkToken(request)
		.then(() => {
			MenuMapper.update(menu)
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
});

router.delete("/v1/deleteMenu", async (request, response) => {
	checkToken(request)
		.then(() => {
			MenuMapper.delete(request.body)
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
});

module.exports = router;
