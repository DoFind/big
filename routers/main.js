/**
 * Created by cc on 2017/5/15.
 */

var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Resource = require('../models/resource');
var Series = require('../models/series');
var Comments = require('../models/comments');
var Loveword = require('../models/loveword');

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

    var cat = req.query.category || '';

    if(cat == ''){
        // 主页
        Resource.find({ bTimeline: true }).populate('category').sort({ time: -1}).then(function (re) {

            data.resources = re;
            res.render('main/index', data);
        })
    }
    else{
        // 分类页面
        Resource.find({ category: cat }).populate('category').sort({ time: -1}).then(function (re) {

            data.category = cat;
            data.resources = re;
            res.render('main/index', data);
        })
    }
/*
    data.category = req.query.category || '';
    // 查询条件
    var where = {};
    if (data.category){
        where.category = data.category;
    }
    // 查询数据
    Resource.where(where).find().populate('category').sort({ time: -1}).then(function (re) {

        data.resources = re;
        res.render('main/index', data);
    })*/
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
        /*Series.update({_id: id}, {$inc: {PV: 1}}, function (err) {
            if(err){
                console.log(err);
            }
        });*/
        // 修改resource中的PV
        /*Resource.update({_id: parentID}, {$inc: {PV: 1}}, function (err) {
            if(err){
                console.log(err);
            }
        });*/

        Series.find({parentRes: parentID}).then(function (re) {

            data.series = re;
            Series.findOne({_id: id}).then(function (vedio) {

                data.curView = vedio;
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
                res.render('main/vedio_detail', data);
            }
            else if (vedio.resType == 'vgroup'){

                // 修改分集视频PV
                // Series.update({parentRes: id}, {$inc: {PV: 1}}, function (err) {
                //     if(err){
                //         console.log(err);
                //     }
                //     else{
                        Series.find({parentRes: id}).then(function (re) {

                            data.series = re;
                            data.curView = re[0];
                            res.render('main/vedio_detail', data);
                        })
                //     }
                // });
            }
        });
        // resource中的PV
        // Resource.update({_id: id}, {$inc: {PV: 1}}, function (err) {
        //     if(err){
        //         console.log(err);
        //     }
        // });
    }
})

/*
* 访问相册，新页面打开
* */
router.get('/main/album', function(req, res){

    var id = req.query.id;

    // 修改访问量PV
    // Resource.update({_id: id}, {$inc: {PV: 1}}, function (err) {
    //     if(err){
    //         console.log(err);
    //     }
    //     else{
            // 访问具体相册
            Resource.findOne({_id: id}).then(function (album) {
                data.curView = album;
                res.render('main/album_detail', data);
            });
    //     }
    // });
})


/*
* 表'白'墙
* */
router.get('/main/lover', function (req, res) {

    Loveword.find().populate('name').sort({time: 1}).then(function (words) {

        data.words = words;
        res.render('main/lover_wall', data);
    })
})

router.post('/main/lover', function (req, res) {

    var content = req.body.content;
    var name = req.userInfo._id;
    console.log(name);

    if(!name){
        res.json({
            msg: '请先登录',
            code: 1
        });
        return;
    }
    if(content == ''){
        res.json({
            msg: '提交内容不能为空',
            code: 2
        });
        return;
    }

    new Loveword({
        name: name,
        content: content,
        time: Date.now()
    }).save();

    res.json({
        msg: '提交成功',
        code: 0
    });
})

router.get('/main/growth', function (req, res) {

    res.render('main/growth', data);
})

module.exports = router;


