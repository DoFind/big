/**
 * Created by cc on 2017/5/15.
 */

var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Resource = require('../models/resource');
var Series = require('../models/series');

var data;

router.use(function (req, res, next) {

    data = {
        userInfo: req.userInfo,
        picCategories: [],
        vedioCategories: []
    }
    Category.find({resType: 'album'}).then(function(picCategories) {
        data.picCategories = picCategories;
    });
    Category.find({resType: 'vedio'}).then(function(vedioCategories) {
        data.vedioCategories = vedioCategories;
    });
    next();
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

    // id  可能是resourceID 也可能是 seriesID
    var id = req.query.id;
    var bSeries = req.query.bSeries;

    if (bSeries) {
        Series.find({parentRes: req.query.parentID}).then(function (re) {

            data.series = re;
            Series.findOne({_id: id}).then(function (vedio) {

                data.vedio = vedio;
                res.render('main/vedio_detail', data);
            })
        })
    }
    else {
        Resource.findOne({
            _id: id
        }).then(function (vedio) {

            if (vedio.resType == 'vedio'){
                data.vedio = vedio;
                res.render('main/vedio_detail', data);
            }
            else if (vedio.resType == 'vgroup'){

                Series.find({parentRes: id}).then(function (re) {

                    data.series = re;
                    data.vedio = re[0];
                    res.render('main/vedio_detail', data);
                })
            }
        })
    }
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


