const Role = require("../model/role");

const RoleMapper = {
	insert: data => {
		return new Promise((resolve, reject) => {
			Role.findOne({
				name: data.name
			})
				.then(role => {
					if (role) {
						resolve(0);
					}
				})
				.catch(exception => {
					const roleEnity = new Role(data);

					roleEnity.save(err => {
						if (err) {
							reject(false);
						} else {
							resolve(1);
						}
					});
				});
		});
	},
	del: data => {
		return new Promise((resolve, reject) => {
			Role.remove({
				_id: data.id
			})
				.then(role => {
					resolve(role);
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	queryById: data => {
		return new Promise((resolve, reject) => {
			Role.findOne({
				_id: data.id
			})
				.then(role => {
					if (role) {
						resolve(role);
					}
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	queryByName: data => {
		return new Promise((resolve, reject) => {
			Role.findOne({
				name: data.name
			})
				.then(role => {
					if (role) {
						resolve(role);
					}
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	update: data => {
		return new Promise((resolve, reject) => {
			Role.findOne({
				_id: data.id
			})
				.then(role => {
					role = data;

					role.save(err => {
						if (err) {
							reject(err);
						} else {
							resolve(true);
						}
					});
				})
				.catch(err => {
					reject(err);
				});
		});
	}
};

module.exports = RoleMapper;
