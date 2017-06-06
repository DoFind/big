/**
 * Created by cc on 2017/5/15.
 */

var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Resource = require('../models/resource');
var Series = require('../models/series');
var Comments = require('../models/comments');

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
router.get('/main/search', function (req, res, next) {

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

        var parentID = req.query.parentID;
        // 修改分集视频PV
        Series.update({_id: id}, {$inc: {PV: 1}}, function (err) {
            if(err){
                console.log(err);
            }
        });
        // 修改resource中的PV
        Resource.update({_id: parentID}, {$inc: {PV: 1}}, function (err) {
            if(err){
                console.log(err);
            }
        });

        Series.find({parentRes: parentID}).then(function (re) {

            data.series = re;
            Series.findOne({_id: id}).then(function (vedio) {

                data.curView = vedio;
                // 评论数据返回
                // Comments.find({resourceID: id}).populate('from').then(function (comments) {
                //     data.comments = comments;
                // });
                res.render('main/vedio_detail', data);
            })
        })

    }
    else {

        Resource.findOne({
            _id: id
        }).then(function (vedio) {
            if (vedio.resType == 'vedio'){
                data.curView = vedio;
                // 评论数据返回
                // Comments.find({resourceID: id}).populate('from').then(function (comments) {
                //     data.comments = comments;
                // });
                res.render('main/vedio_detail', data);
            }
            else if (vedio.resType == 'vgroup'){

                // 修改分集视频PV
                Series.update({parentRes: id}, {$inc: {PV: 1}}, function (err) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        Series.find({parentRes: id}).then(function (re) {

                            data.series = re;
                            data.curView = re[0];
                            // 评论数据返回
                            // Comments.find({resourceID: re[0]._id}).then(function (comments) {
                            //     data.comments = comments;
                            // });
                            res.render('main/vedio_detail', data);
                        })
                    }
                });
            }
        });
        // resource中的普拉PV
        Resource.update({_id: id}, {$inc: {PV: 1}}, function (err) {
            if(err){
                console.log(err);
            }
        });
    }
})

/*
* 访问相册，新页面打开
* */
router.get('/main/album', function(req, res){

    var id = req.query.id;

    // 修改访问量PV
    Resource.update({_id: id}, {$inc: {PV: 1}}, function (err) {
        if(err){
            console.log(err);
        }
        else{
            // 访问具体相册
            Resource.findOne({_id: id}).then(function (album) {
                data.curView = album;
                res.render('main/album_detail', data);

                // 评论数据返回
                // Comments.find({resourceID: id}).populate('from').then(function (comments) {
                //     data.comments = comments;
                //     res.render('main/album_detail', data);
                // });
            });
        }
    });
})


/*
* 表'白'墙
* */
router.get('/main/lovewall', function (req, res) {

    res.render('main/lovewall');
})

router.post('/main/lovewall', function (req, res) {


})

module.exports = router;


