/**
 * Created by cc on 2017/5/15.
 */

var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Resource = require('../models/resource');

router.use(function (req, res, next) {

    data = {
        userInfo: req.userInfo,
        categories: []
    }

    Category.find().then(function(categories) {
        data.categories = categories;
        next();
    });
})

/*
* 访问主页 - 不同分页
* */
router.get('/', function (req, res, next) {

    /*// { 'category ': ' 591febd0738e72120c6cceaa' }
    console.log(req.query);

    data.category = req.query.category
    console.log(data.category);
*/
    // var id = req.query.id || '';
    // undefined
    //console.log(req.query.category);

    //data.category = req.query.category || '';

    // 查询条件
    /*var where = {};
    if (data.category){
        where.categroy = data.category;
    }*/

    // 查询数据
    Resource.find().populate('category').sort({ time: -1}).then(function (re) {

        data.resources = re;

        res.render('main/index', data);
    })
})


/*
* 访问视频详情，新页面打开
* */
router.get('/main/vedio', function (req, res) {

    var id = req.query.id;


    Resource.findOne({
        _id: id
    }).then(function (vedio) {

        data.vedio = vedio;
        res.render('main/vedio_detail', data);
    })
})


module.exports = router;


