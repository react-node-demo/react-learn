const mongoose = require('mongoose')
//即将使用ObjectId作为字段类型，用于实现‘关联文档的查询’
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
//定义角色权限表结构
const RoleFunctionSchema = new mongoose.Schema({
    roleId: {  //关于某个角色，可以ObjectId拿到角色的其他字段
        type: ObjectId,
        ref: 'Role'
    },
    functionId: {  // 关于某个权限，可以ObjectId拿到权限的其他字段
        type: ObjectId,
        ref: 'Functions'
    }
}, {
    versionKey: false  //查询数据库时，忽略 _v 的字段返回
})
//为模式添加静态方法，不会与数据库进行交互，只有在模型实例化编译后产生作用
//PS：通过模型调取
RoleFunctionSchema.statics = {
    findByRoleId: function(rid) {
        return this.find({
            roleId: rid
        })
    },
    getFunEntityByRoleId: function(rid) {
        return this.find({
            roleId: rid
        }, {
            roleId: 0,
            _id: 0
        }).populate({
            path: 'functionId',
            select: { name: 1, parentId: 1, location: 1 }
        }).then(farr => {
            let farray = farr.map(item => {
                return item.functionId
            })
            return Promise.resolve(farray)
        }).catch(err => {
            return Promise.reject()
        })
    },
    insert: function(rid, fids) {
        if (fids && fids.length) {
            let fidsArray = []
            for(let i = 0;i < fids.length; i++) {
                fidsArray.push({
                    roleId: rid, functionId: fids[i]
                })
            }
            return this.insertMany(fidsArray)
        } else {
            return Promise.reject('角色权限关系未选择')
        }        
    },
    removeByRoleId: function(rid) {
        return this.remove({ roleId: rid })
    },
    removeByFunId: function(fid) {
        return this.remove({ functionId: fid })
    }
}
//编译生成RoleFunction模型，并将模型构造函数导出
module.exports = mongoose.model('RoleFunction', RoleFunctionSchema)