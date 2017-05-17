/**
 * Created by cc on 2017/5/15.
 */

var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {

    /*
        读取views目录下的指定文件，解析并返回给客户端
        参数1  模板的文件 相对于views目录 views/index.html
        参数2  传递给模板使用的数据
    */
    res.render('main/index', {
        userInfo: req.userInfo
    });


})

module.exports = router;


