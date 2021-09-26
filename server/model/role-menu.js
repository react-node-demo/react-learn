const mongoose = require("mongoose");

const RoleMenuSchema = mongoose.Schema({
	role_id: {
		type: String,
		unique: true,
		required: true
	},
	menu_id: {
		type: String,
		unique: true,
		required: true
	}
});

const RoleMenu = mongoose.model("RoleMenu", RoleMenuSchema, "role_menu");

module.exports = RoleMenu;
