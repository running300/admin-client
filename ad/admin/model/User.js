const mongoose = require('mongoose')
const Schema = mongoose.Schema;//实例化

//创建 Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {//头像
        type: String
    },
    identity: {//头像
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    
})
User = mongoose.model('users', UserSchema)
module.exports = User


