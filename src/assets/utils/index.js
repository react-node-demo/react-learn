// 递归生成菜单结构
export const generateMenuTree = (data, idName, parentIdName) => {
	const id = idName || "id";
	const parentId = parentIdName || "parentId";

	// 删除 所有 children,以防止多次调用
	data.forEach(function(item) {
		delete item.children;
	});

	// 将数据存储为 以 id 为 KEY 的 map 索引数据列
	const map = {};

	data.forEach(function(item) {
		map[item[id]] = item;
	});

	const menu = [];

	data.forEach(function(item) {
		// 在map中找到当前项的父级菜单
		const parent = map[item[parentId]];

		if (parent) {
			// 如果父级菜单存在，则将当前项存入父级的children
			// 如果父级的children不存在，初始化为空数组[]后再存入
			(parent.children || (parent.children = [])).push(item);
		} else {
			// 如果父级菜单不存在，则做为顶级菜单存入
			menu.push(item);
		}
	});

	return menu;
}