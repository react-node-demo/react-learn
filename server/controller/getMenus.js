const express = require("express");
const router = express.Router();

const MenuMapper = require("../mapper/menu");
const RoleMenuMapper = require("../mapper/role-menu");

const { validateToken } = require("../common/jwt");
const resolve = require("resolve");

// const getRoleToMenu = (data) => {
//     RoleMenuMapper.qu
// }

const generateMenuTree = (menus, parent_id = "0") => {
	let parentObject = {};

	menus.forEach(item => {
		parentObject[item._id] = item;
	});

	if (!parent_id) {
		return menus
			.filter(item => !parentObject[item.parent_id])
			.map(item => ((item.children = generateMenuTree(menus, item._id)), item));
	} else {
		return menus
			.filter(item => item.parent_id === parent_id)
			.map(item => ((item.children = generateMenuTree(menus, item.id)), item));
	}
};

router.post("/v1/getMenus", async (request, response) => {
	const {
		headers: { authorization }
	} = request;

	validateToken(authorization).then(data => {
		MenuMapper.queryAll().then(menus => {
			console.log("menus: ", menus, generateMenuTree(menus));
			// generateMenuTree(menus)
		});
	});
});

module.exports = router;
