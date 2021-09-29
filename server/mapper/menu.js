const Menu = require("../model/menus");

const MenuMapper = {
	insert: data => {
		return new Promise((resolve, reject) => {
			//和之前路由子文件 下面对应 Promise操作修改异步操作 实现同步
			Menu.find({}, (err, docs) => {
				const finded = docs.some(item => data.title === item.title); //如果传来的注册账户和数据库中的有相同的

				console.log("插入： ", docs, finded, data);
				if (finded) {
					resolve(0);
				} else {
					const menuEnity = new Menu(data);

					menuEnity.save(err => {
						if (err) {
							reject(err);
						} else {
							resolve(1);
						}
					});
				}
			});
		});
	},
	delete: data => {
		return new Promise((resolve, reject) => {
			Menu.findByIdAndDelete(data.id, (err, res) => {
				console.log("Menu删除：", err);
				if (err) {
					reject(err);
				} else {
					resolve(true);
				}
			});
		});
	},
	queryById: data => {
		return new Promise((resolved, rejected) => {
			Menu.findOne({
				_id: data.id
			}).then(menu => {
				if (menu) {
					resolved(menu);
				} else {
					rejected(null);
				}
			});
		}).catch(err => {
			return err;
		});
	},
	queryAll: data => {
		return new Promise((resolve, reject) => {
			Menu.find()
				.then(menus => {
					if (menus.length) {
						resolve(menus);
					}
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	update: data => {
		return new Promise((resolve, reject) => {
			// 根据id查找对应用户，并修改对应内容
			let query = {
				_id: data.id
			};
			let updateData = {
				modifiedTime: Date.now()
			};

			for (let i in data) {
				if (i.indexOf("id") === -1) {
					updateData[i] = data[i];
				}
			}

			Menu.findOneAndUpdate(
				query,
				{
					$set: updateData
				},
				{},
				(err, res) => {
					console.log("err " + err + " res " + res);
					if (err) {
						reject(err);
					} else {
						resolve(true);
					}
				}
			);
		});
	}
};

module.exports = MenuMapper;
