/**
 * Created by cc on 2017/5/15.
 */

var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Resource = require('../models/resource');

var data;

router.use(function (req, res, next) {

    data = {
        userInfo: req.userInfo,
        categories: []
    }
    Category.find().sort({resType: -1}).then(function(categories) {
        data.categories = categories;
        next();
    });
})

/*
* 访问主页 - 不同分页
* */
router.get('/', function (req, res, next) {

    data.category = req.query.category || '';
    // data.search = req.query.search || '';

    // 查询条件
    var where = {};
    if (data.category){
        where.category = data.category;
    }
    // if (data.search){
    //     where.title = new RegExp(data.search + '.*', 'i');
    // }

    // 查询数据
    Resource.where(where).find().populate('category').sort({ time: -1}).then(function (re) {

        data.resources = re;
        res.render('main/index', data);
    })
})
/*
* 搜索
* */
router.get('/search', function (req, res, next) {

    data.search = req.query.search || '';

    // 查询条件
    var where = {};
    if (data.search){
        where.title = new RegExp(data.search + '.*', 'i');
    }

    // 查询数据
    Resource.where(where).find().populate('category').sort({ time: -1}).then(function (re) {

        data.resources = re;
        res.render('main/index', data);
    })
})


/*
* 访问视频详情，新页面打开
* */
router.get('/main/vedio', function(req, res) {

    var id = req.query.id;


    Resource.findOne({
        _id: id
    }).then(function (vedio) {

        data.vedio = vedio;
        res.render('main/vedio_detail', data);
    })
})

/*
* 访问相册，新页面打开
* */
router.get('/main/album', function(req, res){

    var id = req.query.id;

    Resource.findOne({_id: id}).then(function (album) {

        data.album = album;
        res.render('main/album_detail', data);
    })
})


module.exports = router;


