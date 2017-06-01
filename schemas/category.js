/**
 * Created by cc on 2017/5/15.
 */

var mongoose = require('mongoose');

// 定义分类表结构

module.exports = new mongoose.Schema({

    name: String,

    // 权重
    weight: Number,

    // 分组下的内容，这个暂时没有功能需求
    resource: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    }],

    // 视频vedio， 图片album
    resType: {
        type: String,
        default: ''
    }
});