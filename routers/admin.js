/**
 * Created by cc on 2017/5/15.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Category = require('../models/category');

router.use(function (req, res, next) {
    if(!req.userInfo.isAdmin){
        res.send('对不起，您没有权限进入后台管理..');
        return;
    }
    next();
})


/*
* 首页
* */
router.get('/', function (req, res) {

    res.render('admin/index', {
        userInfo: req.userInfo
    })

})

/*
* 用户管理
* */
router.get('/user', function (req, res) {

    /*
     * 从数据库中读取所有的用户数据
     *
     * limit(Num) : 限制获取的数据条数
     *
     * skip(Num) : 忽略数据的条数
     *
     * 每页显示2条
     * 1 : 1-2 skip:0 -> (当前页-1) * limit
     * 2 : 3-4 skip:2
     * */

    var page = Number(req.query.page || 1);
    var pages = 0;
    var limit = 10;
    var skip = 0;

    User.count().then(function (count) {

        // 计算总页数
        pages = Math.ceil(count / limit);
        // 页数限制
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        // 计算skip
        skip = ( page - 1 ) * limit;

        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user', {
                userInfo: req.userInfo,
                users: users,

                page: page,
                pages: pages,
                limit: limit,
                count: count
            })
        })
    })
})

/*
* 分类管理首页信息返回
* */
function getCategory(req, res, bShow, bSuc, message) {

    bShow = bShow || false;
    bSuc = bSuc || false;
    message = message || '';

    var page = Number(req.query.page || 1);
    var pages = 0;
    var limit = 10;
    var skip = 0;

    Category.count().then(function (count) {

        // 计算总页数
        pages = Math.ceil(count / limit);
        // 页数限制
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        // 计算skip
        skip = ( page - 1 ) * limit;

        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {

            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,

                page: page,
                pages: pages,
                limit: limit,
                count: count,

                bShow: bShow,
                bSuc: bSuc,
                message: message
            })
        })
    })
}

/*
* 分类管理 -- 分类首页
* */
router.get('/category', function (req, res) {

    getCategory(req, res);
})


/*
 * 分类管理 -- 新增分类
 * */
router.get('/category/add', function (req, res) {

    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
})

router.post('/category/add', function (req, res) {

    var name = req.body.name.replace(/(^\s*)|(\s*$)/g, "") || '';

    if (name == '') {
        res.render('admin/category_add', {
            userInfo: req.userInfo,
            bShow: true,
            isSuc: false,
            message: '分类名称不能为空..'
        });
        return;
    }

    //分类名称是否已存在
    Category.findOne({
        name: name
    }).then(function (category) {
        if(category) {
            res.render('admin/category_add', {
                userInfo: req.userInfo,
                bShow: true,
                isSuc: false,
                message: '分类信息已存在..'
            });
            return Promise.reject();;
        }
        else {
            return new Category({
                name: name
            }).save();
        }
    }).then(function () {

        getCategory(req, res, true, true, '分类信息保存成功');

        /*res.render('admin/category_index', {
            userInfo: req.userInfo,
            isSuc: true,
            message: '分类信息保存成功'
        })*/
    })
})

/*
 * 分类管理 -- 修改分类
 * */
router.get('/category/edit', function (req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';

    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function (category) {

        if(category){
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                bShow: true,
                isSuc: false,
                message: '分类信息不存在..'
            });
        }
    })
})

router.post('/category/edit', function (req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';

    //获取post提交过来的名称 body拿到的是表单中 name='name' 的value！！！！！！！
    var name = req.body.name.replace(/(^\s*)|(\s*$)/g, "") || '';

    if (name == '') {
        res.render('admin/category_edit', {
            userInfo: req.userInfo,
            bShow: true,
            isSuc: false,
            message: '分类名称不能为空..'
        });
        return;
    }

    //要修改的分类信息是否存在
    Category.findOne({
        _id: id
    }).then(function (category) {

        if(!category) {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                bShow: true,
                isSuc: false,
                message: '分类信息不存在..'
            });
            return Promise.reject();
        }
        else {

            if (name == category.name) {

                // 这么调用没有反应
                // getCategory(req, res, true, true, '分类名称修改成功');
                res.render('admin/category_edit', {
                    userInfo: req.userInfo,
                    bShow: true,
                    isSuc: false,
                    message: '分类名称不曾改变..'
                });
                return Promise.reject();
            }
            else {

                //查询看看 修改后的分类名称是否已经存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                });
            }
        }
    }).then(function (sameCategory) {

        if (sameCategory) {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                bShow: true,
                isSuc: false,
                message: '该分类名称已存在..'
            });
            return Promise.reject();
        }
        else {
            // update  参数1 要修改谁； 参数2 改成什么
            return Category.update({ _id: id },{ name: name });
        }
    }).then(function () {

        getCategory(req, res, true, true, '分类名称修改成功');
        /*res.render('admin/category_index', {
            userInfo: req.userInfo,
            isSuc: true,
            message: '分类名称修改成功'
        });*/
    })
})

/*
* 分类管理 -- 分类删除
* */
router.get('/category/delete', function (req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';

    //获取要修改的分类信息
    Category.remove({
        _id: id
    }).then(function () {

        getCategory(req, res, true, true, '删除分类成功');
        /*res.render('admin/category_index', {
            userInfo: req.userInfo,
            isSuc: true,
            message: '删除分类成功'
        });*/
    })
})


// 对外暴露
module.exports = router;