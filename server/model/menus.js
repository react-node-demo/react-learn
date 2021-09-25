const mongoose = require("mongoose");

const MenuSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    },
    parent_id: {
        type: String,
        unique: true
    },
    visible: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false  //查询数据库时，忽略 _v 的字段返回
})

MenusSchema.static = {
    insertMenu: MenuSchema.create()
}

const Menu = mongoose.model("Menu", MenuSchema);

module.exports = Menu;