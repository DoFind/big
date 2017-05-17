/**
 * Created by cc on 2017/5/15.
 */

var express = require('express');
var router = express.Router();


router.use(function (req, res, next) {
    if(!req.userInfo.isAdmin){
        res.send('对不起，您没有权限进入后台管理..');
        return;
    }
    next();
})
router.get('/', function (req, res, next) {

    res.render('admin/index', {
        userInfo: req.userInfo
    })

})

// 对外暴露
module.exports = router;