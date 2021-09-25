//加载数据库模块
const mongoose = require('mongoose')
//定义权限表结构
const FunctionsSchema = new mongoose.Schema({
    name: String, //权限名
    parentId: {   //上级权限的_id
        type: String,
        default: 0
    },
    location: String  //权限的资源地址，用于菜单跳转页面
}, {
    versionKey: false  //查询数据库时，忽略 _v 的字段返回
})

//为模式添加静态方法，不会与数据库进行交互，只有在模型实例化编译后产生作用
//PS：通过模型调取
FunctionsSchema.statics = {
    findAll: function() {
        return this.find()
    },
    findOneById: function(id) {
        return this.findOne({ _id: id })
    },
    save: function(opts) {
        return this.create(opts)
    },
    updateById: function(id, opts) {
        return this.update({
            _id: id
        }, opts).then(rs => {
            if (rs.ok) {
                return Promise.resolve()
            } else {
                return Promise.reject('数据库更新权限dao失败')
            }
        })
    },
    removeById: function(id) {
        return this.remove({
            _id: id
        })
    }
}
//编译生成Functions模型，并将模型构造函数导出
module.exports = mongoose.model('Functions', FunctionsSchema)