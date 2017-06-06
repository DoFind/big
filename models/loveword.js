/**
 * Created by cc on 2017/6/6.
 */

var mongoose = require('mongoose');
var LovewordSchema = require('../schemas/loveword');

// 用于对数据库表Loveword 进行数据操作
module.exports = mongoose.model('Loveword', LovewordSchema);