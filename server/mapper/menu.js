const Menu = require("../model/menus");

const MenuMapper = {
    insert: (data) => {
        return new Promise((resolved,rejected)=>{ //和之前路由子文件 下面对应 Promise操作修改异步操作 实现同步
            User.find({}, (err,docs) => {
                const finded = docs.some(item => data.name === item.name); //如果传来的注册账户和数据库中的有相同的

                if (finded) {
                    resolved(false)
                } else {
                    const menuEnity = new Menu(data);

                    menuEnity.save(err=>{
                        if (err) {
                            rejected(false)
                        } else {
                            resolved(true)
                        }
                    })
                }
            })
        })
    },
    del: (data) => {
        return new Promise((resolved,rejected)=>{ //和之前路由子文件 下面对应 Promise操作修改异步操作 实现同步
            Menu.remove({
                _id: data.id
            }).then((user) => {
                resolve(true);
            }).catch((err) => {
                reject(false);
            })
        })
    },
    queryById: (data) => {
        return new Promise((resolved,rejected)=>{
            Menu.findOne({
                _id: data.id
            }).then((menu) => {
                if (menu) {
                    resolved(menu)
                } else {
                    rejected(null)
                }
            })
        }).catch((err)=>{
          return err;
        })
    },
    update: (data) => {
        return new Promise((resolved,rejected)=>{
            // 根据id查找对应用户，并修改对应内容
            Menu.findById(data.id,(err,doc)=>{
                doc = data;

                doc.save(err=>{
                    if(err){
                        rejected(false)
                    }else{
                        resolved(true)
                    }
                })
            })
        })
    }
}

module.exports = MenuMapper;