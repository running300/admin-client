//@login & register
const express = require('express')
const bcrypt = require('bcrypt')//加密插件
const gravatar = require('gravatar');//处理头像插件
const jwt = require('jsonwebtoken');//token的处理
const passport = require('passport');
const router = express.Router();

const User = require("../../model/User.js")
const { secretOrKry } = require('../../config/keys.js')


//$route POST api/users/register
//@desc 返回请求的json数据
//@access 公开的接口(public)
router.post('/register', (req, res) => {
    // console.log(req.body);
    // 查询数据库中是否拥有邮箱
    User.findOne({email: req.body.email})
        .then((user) => {
            if(user) {
                return res.status(400).json('邮箱已被注册')
            }else {
                const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});//404报错 mm有一个头像
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,//头像最后处理
                    password: req.body.password,
                    identity: req.body.identity
                })
                // ? 加密
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err, hash) {//加密的数据是哪一个
                        // hash加密后的密码
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()//存储数据库
                                .then(user => res.json(user))
                                .catch(err => console.log(err))
                    });
                });

            }
        })
})


//$route POST api/users/login
//@desc 返回 token jwt passport
//@access 公开的接口(public)
router.post('/login', (req, res) => {
    const email = req.body.email,
          password = req.body.password;
    
    //插询数据库
    User.findOne({email})
        .then(user => {
            //邮箱匹配
            if(!user) {
                return res.status(404).json('用户不存在')
            }
            //密码匹配(解密)
            bcrypt.compare(password, user.password)
                  .then(isMatch => {
                      if(isMatch) {//匹配成功
                        // jwt.sign("规则","加密名字","过期时间", "箭头函数")         
                        const rule = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar,
                            identity: user.identity
                        }
                        jwt.sign(rule, secretOrKry, {expiresIn: 3600}, (err, token) => {
                            if(err) throw err;
                            res.json({
                                success: true,
                                token: 'Bearer ' + token//一定是这个
                            })
                        })
                        // res.json({msg: 'success'})
                      }else {
                          return res.status(400).json("密码错误!!")
                      }
                  })
        })
})


//$route GET api/users/current
//@desc 返回 用户信息
//@access 公开的接口(private)
router.get('/current', passport.authenticate("jwt", {session: false}) ,(req, res) => {//验证jwt
    // 验证token
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    })
})


module.exports = router;