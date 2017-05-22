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

/*router.get('/', function (req, res, next) {

    /!*
        读取views目录下的指定文件，解析并返回给客户端
        参数1  模板的文件 相对于views目录 views/index.html
        参数2  传递给模板使用的数据
    *!/
    res.render('main/index', {
        userInfo: req.userInfo
    });
})*/

router.get('/', function (req, res, next) {

    // { 'category ': ' 591febd0738e72120c6cceaa' }
    console.log(req.query);
    // undefined
    console.log(req.query.category);

    data.category = req.query.category || '';

    // 查询条件
    var where = {};
    if (data.category){
        where.categroy = data.category;
    }

    // 查询数据
    Resource.where(where).find().populate(['category']).sort({ time: -1}).then(function (re) {

        data.res = re;

        //console.log(data);
        res.render('main/index', data);
    })

})

module.exports = router;


