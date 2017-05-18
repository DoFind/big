/**
 * Created by cc on 2017/5/15.
 */

var mongoose = require('mongoose');
var categorySchema = require('../schemas/category');

// 用于对数据库表user 进行数据操作
module.exports = mongoose.model('Category', categorySchema);