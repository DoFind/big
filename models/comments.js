/**
 * Created by cc on 2017/6/1.
 */

var mongoose = require('mongoose');
var CommentsSchema = require('../schemas/comments');

// 用于对数据库表Comments 进行数据操作
module.exports = mongoose.model('Comments', CommentsSchema);