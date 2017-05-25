/**
 * Created by cc on 2017/5/15.
 */

var mongoose = require('mongoose');

// 定义分类表结构

module.exports = new mongoose.Schema({

    name: String,

    // 视频vedio， 图片pic
    resType: {
        type: String,
        default: ''
    }
});