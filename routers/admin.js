/**
 * Created by cc on 2017/5/15.
 */

var express = require('express');
var router = express.Router();

router.get('/user', function (req, res, next) {

    res.send('user');

})

// 对外暴露
module.exports = router;