const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')//引入body-parser
const passport = require('passport')//处理token

const app = express();

//? 引入user路由处理模块
const users = require('./routers/api/users.js')
// ! 引入Profile路由处理模块
const profiles = require('./routers/api/profiles.js')


const port = process.env.PORT || 5000;

// ? 使用body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())



//?连接数据库
mongoose.connect("mongodb://localhost:27017/express-test",{
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => {console.log('mongodb connect success')})
.catch((err) => {console.log(err)})

//? possport 初始化
app.use(passport.initialize())
require('./config/passport.js')(passport);

app.use('/api/users', users)
app.use('/api/profiles', profiles)


app.listen(port, () => {
    console.log('port is running')
})

