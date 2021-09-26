const mongoose = require("mongoose");

const MenuSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true
		},
		url: {
			type: String,
			required: true,
			unique: true
		},
		parent_id: {
			type: String,
			unique: true
		},
		createTime: {
			type: Date,
			default: Date.now()
		},
		modifiedTime: {
			type: Date,
			default: Date.now()
		}
	},
	{
		versionKey: false //查询数据库时，忽略 _v 的字段返回
	}
);

const Menu = mongoose.model("Menu", MenuSchema, "menu");

module.exports = Menu;
