//@login & register
const express = require('express')
const passport = require('passport');
const router = express.Router();
const Profile = require("../../model/Profile.js")


//$route GET api/profiles/test
//@desc 返回请求的json数据
//@access 公开的接口(public)
router.get('/test' ,(req, res) => {
    res.json({msg: 'login word'})
})

//$route POST api/profiles/add 添加数据
//@desc 创建信息接口
//@access 公开的接口(private)
router.post('/add', passport.authenticate("jwt", {session: false}),(req, res) => {
    const profileFileds = {}
    if(req.body.type) { profileFileds.type = req.body.type };
    if(req.body.describe) { profileFileds.describe = req.body.describe };
    if(req.body.income) { profileFileds.income = req.body.income };
    if(req.body.expend) { profileFileds.expend = req.body.expend };
    if(req.body.cash) { profileFileds.cash = req.body.cash };
    if(req.body.remark) { profileFileds.remark = req.body.remark };

    //存入数据库
    new Profile(profileFileds).save().then(profile => {
        res.json(profile);
    })
})

//$route GET api/profiles 获取所有信息
//@desc 创建信息接口
//@access 公开的接口(private)
router.get('/', passport.authenticate("jwt", {session: false}),(req, res) => {
    Profile.find()//?查询所有
            .then(profile => {
                if(!profile) {
                    return res.status(404).json("没有获取任何内容")
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json(err))
})


//$route GET api/profiles/:id 获取单个信息
//@desc 创建信息接口
//@access 公开的接口(private)
router.get('/:id', passport.authenticate("jwt", {session: false}),(req, res) => {
    Profile.findOne({_id: req.params.id})//?前端发过来的id
            .then(profile => {
                if(!profile) {
                    return res.status(404).json("没有获取任何内容")
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json(err))
})


//$route POST api/profiles/edit 编辑信息
//@desc 创建信息接口
//@access 公开的接口(private)
router.post('/edit/:id', passport.authenticate("jwt", {session: false}),(req, res) => {
    const profileFileds = {}
    if(req.body.type) { profileFileds.type = req.body.type };
    if(req.body.describe) { profileFileds.describe = req.body.describe };
    if(req.body.income) { profileFileds.income = req.body.income };
    if(req.body.expend) { profileFileds.expend = req.body.expend };
    if(req.body.cash) { profileFileds.cash = req.body.cash };
    if(req.body.remark) { profileFileds.remark = req.body.remark };

    //存入数据库
    Profile.findOneAndUpdate(//查找并更新
        {_id: req.params.id},//id
        {$set: profileFileds},//更新的内容
        {new: true}
    ).then(profile => res.json(profile))
})

//$route DELETE api/profiles/delete 编辑信息
//@desc 删除信息接口
//@access 公开的接口(private)
router.delete('/delete/:id', passport.authenticate("jwt", {session: false}),(req, res) => {
    //存入数据库
    console.log(req.params.id)
    Profile.findOneAndDelete({_id : req.params.id})
    .then(profile => {
        console.log(profile)
        res.json(profile)//假删除
    })
    .catch(err => res.status(404).json("删除失败!!"))
})


module.exports = router;