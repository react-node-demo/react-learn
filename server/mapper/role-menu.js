const resolve = require("resolve");
const RoleMenu = require("../mapper/role-menu");

const RoleMenuMapper = {
	insert: data => {
		return new Promise((resolve, reject) => {
			//和之前路由子文件 下面对应 Promise操作修改异步操作 实现同步
			RoleMenu.find({}, (err, docs) => {
				const finded = docs.some(item => data.role_id === item.role_id && data.menu_id === item.menu_id); //如果传来的注册账户和数据库中的有相同的

				if (finded) {
					resolve(0);
				} else {
					const roleMenunity = new RoleMenu(data);

					roleMenunity.save(err => {
						if (err) {
							resolve(1);
						} else {
							reject(false);
						}
					});
				}
			});
		});
	},
	del: data => {
		return new Promise((resolve, reject) => {
			//和之前路由子文件 下面对应 Promise操作修改异步操作 实现同步
			RoleMenu.remove({
				_id: data.id
			})
				.then(user => {
					resolve(true);
				})
				.catch(err => {
					reject(false);
				});
		});
	},
	queryByRoleId: data => {
		return new Promise((resolve, reject) => {
			RoleMenu.findOne({
				role_id: data.id
			})
				.then(roleMenu => {
					if (roleMenu) {
						resolve(roleMenu);
					} else {
						resolve(null);
					}
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	queryByMenuId: data => {
		return new Promise((resolve, reject) => {
			RoleMenu.findOne({
				menu_id: data.id
			})
				.then(roleMenu => {
					if (roleMenu) {
						resolve(roleMenu);
					} else {
						resolve(null);
					}
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	update: data => {
		return new Promise((resolve, reject) => {
			RoleMenu.findById(data.id, (err, doc) => {
				doc = data;

				doc.save(err => {
					if (err) {
						reject(err);
					} else {
						resolve(true);
					}
				});
			});
		});
	}
};

module.exports = RoleMenuMapper;
