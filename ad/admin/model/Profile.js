//? 数据模型

const mongoose = require('mongoose')
const Schema = mongoose.Schema;//实例化


//创建 Schema
const ProfileSchema = new Schema({//字段
    type: {
        type: String
    },
    describe: {//描述
        type: String
    },
    income: {//收入
        type: String,
        required: true
    },
    expend: {//支出
        type: String,
        required: true
    },
    cash: {//现金
        type: String,
        required: true
    },
    remark: {//备注
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }  
})
Profile = mongoose.model('profile', ProfileSchema)
module.exports = Profile


