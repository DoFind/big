/**
 * Created by cc on 2017/5/15.
 */

var mongoose = require('mongoose');
var SeriesSchema = require('../schemas/series');

// 用于对数据库表Series 进行数据操作
module.exports = mongoose.model('Series', SeriesSchema);