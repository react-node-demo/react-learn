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

/**
 * @description 生成指定长度和基数的uuid
 * @param {*} len 长度
 * @param {*} radix 基数
 * @returns 
 */
export const generateUUID = (len, radix) => {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
	
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
    } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}

export const dateFormat = (fmt, date) => {
	let ret;
	const opt = {
		"Y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"S+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
		}
	}
	return fmt;
}

/**
 * @description 返回去重后的数组
 * @param {*} arr 要去重的数组
 * @param {*} key 去重的关键字
 * @returns 
 */
export const filterArray = (arr, key) => {
    if (!arr) return arr
    if (key === undefined) return [...new Set(arr)]
    const map = {
        'string': e => e[key],
        'function': e => key(e),
    }
    const fn = map[typeof key]
    const obj = arr.reduce((o,e) => (o[fn(e)]=e, o), {})
    return Object.values(obj)
}

/**
 * @description  仿loadsh的omit方法实现去除对象中的某个属性，同时不保留属性名
 * @param {*} obj // 待去除属性的对象
 * @param {*} uselessKeys // 待去除的属性，可以是数组
 * @returns 返回去除属性后的对象
 */
export const omit = (obj, uselessKeys) =>
	Object.keys(obj).reduce((accumulator, index) => {
		return uselessKeys.includes(index) ? accumulator : { ...accumulator, [index]: obj[index] };
	}, {})

/**
 * @description 对象数组去除不需要的属性
 * @param {*} array // 待去除不需要属性的对象数组
 * @param {*} uselessKeys // 待去除的属性，可以是数组
 * @returns 返回去除不需要属性后的数组
 */
export const omitArray = (array, uselessKeys) => {
	let newArr = [];
	newArr = array.reduce((accumulator, index) => {
		return [...accumulator, omit(index, uselessKeys)];
	}, []);
	return newArr;
}

/**
 * @description 数组分类方法
 * @param {*} array // 类目数组
 * @param {*} classified // 待分类数组
 * @param {*} property // 类目数组的类目
 * @param {*} classifiedProperty // 待分类数组的类目
 * @param {*} category // 分好类的类目item名
 * @returns 分类好的数组
 */
export const classifyArray = (array, classified, property, classifiedProperty, category) => {
	let newArray = [];
	for (let i = 0; i < array.length; i++) {
		let param = {};
		param[property] = array[i][property];
		param[category] = [];
		for (let j = 0; j < classified.length; j++) {
			if (classified[j][classifiedProperty] === array[i][property]) {
				param[category].push(classified[j]);
			}
		}
		newArray.push(param);
	}
	return newArray;
}

/**
 * @description 省略号隐藏多余文本
 * @param {*} text 要进行省略号隐藏的文本
 * @param {*} len 限制隐藏的字数
 * @returns
 */
export const ellipsisText = (text, len) => {
	let str = "";
	if (text.length > len) {
		for (let i = 0; i < len; i++) {
			str += text[i];
		}
		str += "...";
	} else {
		str = text;
	}
	return str;
}

/**
 * @description 数字每隔三位加一个逗号
 * @param {*} num
 * @returns
 */
export const thousands = num => {
	var str = num.toString();
	var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
	return str.replace(reg, "$1,");
}

/**
 * @description 节流，规定时间内只触发一次操作
 * @param {*} fn
 * @param {*} interval
 * @returns
 */
// fn是我们需要包装的事件回调, interval是时间间隔的阈值
export const throttle = (fn, interval) => {
	// last为上一次触发回调的时间
	let last = 0;

	// 将throttle处理结果当作函数返回
	return function() {
		// 保留调用时的this上下文
		let context = this;
		// 保留调用时传入的参数
		let args = arguments;
		// 记录本次触发回调的时间
		let now = +new Date();

		// 判断上次触发的时间和本次触发的时间差是否小于时间间隔的阈值
		if (now - last >= interval) {
			// 如果时间间隔大于我们设定的时间间隔阈值，则执行回调
			last = now;
			fn.apply(context, args);
		}
	};
}

/**
 * @description 防抖，规定时间取最后一次操作
 * @param {*} fn
 * @param {*} delay
 * @returns
 */
// fn是我们需要包装的事件回调, delay是每次推迟执行的等待时间
export const debounce = (fn, delay) => {
	// 定时器
	let timer = null;

	// 将debounce处理结果当作函数返回
	return function() {
		// 保留调用时的this上下文
		let context = this;
		// 保留调用时传入的参数
		let args = arguments;

		// 每次事件被触发时，都去清除之前的旧定时器
		if (timer) {
			clearTimeout(timer);
		}
		// 设立新定时器
		timer = setTimeout(function() {
			fn.apply(context, args);
		}, delay);
	};
}

/**
 * @description 获取url的各个部分的信息
 * @param {*} url
 * @returns
 */
export const getUrlParams = url => {
	let matches = url.split("?");
	let location = matches[0];
	let params = matches[1];
	let param = [],
		values = [],
		queryString = {};
	if (params) {
		param = params.split("&");
	}

	for (let i = 0; i < param.length; i++) {
		let paramItem = param[i].split("=");
		queryString[paramItem[0]] = paramItem[1];
	}

	return {
		param,
		location,
		queryString
	};
}

export const getImgInfo = netUrl => {
	const http = netUrl.split("?")[0];
	const imgInfo = http.split("/");
	const imgName = imgInfo[imgInfo.length - 1].split(".")[0];
	const imgExtension = imgInfo[imgInfo.length - 1].split(".")[1];
	return {
		imgName,
		imgExtension
	};
}
