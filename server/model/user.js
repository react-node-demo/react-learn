// 引入 mongoose
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // 加密插件

// 建立用户表
const UserSchema = new mongoose.Schema({
	nickname: {
		type: String,
		required: true
	},
	telphone: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	identity: {
		type: String,
		required: true
	},
	createDate: {
		type: Date,
		default: Date.now()
	}
}, {
    versionKey: false  //查询数据库时，忽略 _v 的字段返回
});

// 注册静态方法
UserSchema.statics = {
	comparePassword: (_pass, password) => {
		//验证方法
		// _pass传递过来的密码，password是数据库中的密码
		return new Promise((res, rej) => {
			bcrypt.compare(_pass, password, (err, isMath) => {
				//compare官方方法
				if (!err) {
					res(isMath); // isMath返回true和false,true代表验证通过
				} else {
					rej(err);
				}
			});
		});
	}
}

// 建立用户数据库模型
const User = mongoose.model("User", UserSchema);

module.exports = User;
