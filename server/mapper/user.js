const User = require('../model/user');
const bcrypt = require("bcrypt"); // 加密插件

const UserMapper = {
    // 新增用户
    insert: (data) => {
        return new Promise((resolve, reject)=>{ //和之前路由子文件 下面对应 Promise操作修改异步操作 实现同步
            User.find({}, (err,docs) => {
                const finded = docs.some(item=>data.telphone == item.telphone); //如果传来的注册账户和数据库中的有相同的

                if (finded) {
                    resolve(0);
                } else {
                    const userEnity = new User(data);

                    const SALT_WORK_FACTOR = 10; // 默认 10, 加密的幂次

                    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
                        bcrypt.hash(userEnity.password, salt, (err, hash) => {
                            if (err) throw err;
                            userEnity.password = hash;

                            userEnity.save(err=>{
                                if(err){
                                    reject(err)
                                }else{
                                    resolve(1)
                                }
                            })
                        });
                    });
                }
            })
        })
    },
    // 删除用户
    delete: (data) => {
        console.log("USer删除：",data)
        return new Promise((resolve, reject) => {
            User.findByIdAndDelete(data.id, (err, res) => {
				console.log("Menu删除：", res);
				if (err) {
					reject(err);
				} else {
					resolve(true);
				}
			});
        })
    },
    // 根据手机号查找用户
    queryByTelphone: (data) => {
        return new Promise((resolve, reject)=>{
            User.findOne({
                telphone: data.telphone
            }).then((user) => {
                if (user) {
                    resolve(user)
                } else {
                    reject(null)
                }
            }).catch((err)=>{
                reject(err)
              })
        })
    },
    // 根据id查找用户
    queryById: (data) => {
        return new Promise((resolve, reject)=>{
            User.findOne({
                _id: data.id
            }).then((user) => {
                if (user) {
                    resolve(user)
                } else {
                    reject(null)
                }
            }).catch((err)=>{
                reject(err);
            })
        })
    },
    // 获取所有用户
    queryUsers: (data) => {
        return new Promise((resolve, reject)=>{
            User.find().then((users) => {
                if (users) {
                    resolve(users)
                } else {
                    reject([])
                }
            }).catch((err)=>{
                reject(err);
              })
        })
    },
    // 更新用户信息
    update: (data) => {
        return new Promise((resolve ,reject)=>{
            // 根据id查找对应用户，并修改对应内容
            User.findById(data.id,(err,doc)=>{
                doc = data;

                doc.save(err=>{
                    if(err){
                        reject(false)
                    }else{
                        resolve(true)
                    }
                })
            })
        })
    },
}

module.exports = UserMapper;