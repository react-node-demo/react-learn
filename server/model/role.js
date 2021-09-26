// 引入 mongoose
const mongoose = require("mongoose");

// 建立角色表
const RoleSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
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

// 建立用户数据库模型
const Role = mongoose.model("Role", RoleSchema, "role");

module.exports = Role;
