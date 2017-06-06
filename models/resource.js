/**
 * Created by cc on 2017/5/15.
 */

var mongoose = require('mongoose');
var ResourceSchema = require('../schemas/resource');

// 用于对数据库表Resource 进行数据操作
module.exports = mongoose.model('Resource', ResourceSchema);