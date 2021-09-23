// 引入 mongoose
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
	}
});

const SALT_WORK_FACTOR = 10; // 默认 10, 加密的幂次

UserSchema.pre("save", function (next) {
	console.log("写入操作......");
	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if (err) return next(err);
		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) return next(err);
			this.password = hash;
			next();
		});
	});
});

// UserSchema.methods = {
// 	comparePassword: (_pass, password) => {
// 		//验证方法
// 		// _pass传递过来的密码，password是数据库中的密码
// 		return new Promise((res, rej) => {
// 			bcrypt.compare(_pass, password, (err, isMath) => {
// 				//compare官方方法
// 				if (!err) {
// 					res(isMath); // isMath返回true和false,true代表验证通过
// 				} else {
// 					rej(err);
// 				}
// 			});
// 		});
// 	}
// };

// 将密码解密验证注册成User模型的静态方法
UserSchema.statics.comparePassword = (_pass, password) => {
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
};

// 建立用户数据库模型
const User = mongoose.model("User", UserSchema);

module.exports = User;
