// 引入 mongoose
const mongoose = require("mongoose");

// 建立角色表
const RoleSchema = new mongoose.Schema({
	name: {
        type: String,
        required: true,
        unique: true
    },
    createDate: {
        type: Date,
        required: false
    }
}, {
    versionKey: false  //查询数据库时，忽略 _v 的字段返回
});

RoleSchema.statics = {
    findAll: function() {
        return this.find()
    },
    findOneById: function(id) {
        return this.findOne({
            _id: id
        })
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
                return Promise.reject('数据库更新角色名失败')
            }
        })
    },
    removeById: function(id) {
        return this.remove({
            _id: id
        })
    }
}

// 建立用户数据库模型
const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;
