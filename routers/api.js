/**
 * Created by cc on 2017/5/15.
 * 注册 登录..
 */


var express = require('express');
var router = express.Router();
var responseData;
var User = require('../models/user');

// 设置统一返回格式
router.use(function (req, res, next) {
    responseData = {
        code: 0,
        msg: ''
    }
    next();
})

// 注册
router.post('/user/register', function(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    console.log(username);
    console.log(password);
    console.log(repassword);

    if (username == ''){
        responseData.code = 1;
        responseData.msg = '用户名不能为空';
        res.json(responseData);
        return;
    }
    if (password == '' || repassword == ''){
        responseData.code = 2;
        responseData.msg = '密码不能为空';
        res.json(responseData);
        return;
    }
    if (password != repassword){
        responseData.code = 3;
        responseData.msg = '两次密码输入不一致';
        res.json(responseData);
        return;
    }


    User.findOne({
        username: username
    }).then(function (userInfo) {

        if(userInfo){
            // 表示数据库中已有该条记录
            responseData.code = 4;
            responseData.msg = '该用户名已被注册';
            res.json(responseData);
            return;
        }
        // 数据库中的一条记录就是这里的一个对象
        var user = new User({
            username: username,
            password: password
        });
        // 存到数据库中
        return user.save();
    }).then(function (newUserInfo) {
        responseData.msg = '注册成功';
        res.json(responseData);
        return;
    });

})


// 登录
router.post('/user/login', function (req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    if (username == '' || password == ''){
        responseData.code = 5;
        responseData.msg = '用户名或密码不能为空';
        res.json(responseData);
        return;
    }

    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {

        if(!userInfo){

            responseData.code = 6;
            responseData.msg = '用户名或密码错误';
            res.json(responseData);
            return;
        }
        responseData.msg = '登录成功';
        res.json(responseData);
        return;
    });
})

module.exports = router;