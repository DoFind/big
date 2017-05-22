/**
 * Created by cc on 2017/5/15.
 */

var mongoose = require('mongoose');

// 定义分类表结构

module.exports = new mongoose.Schema({

    title: String,
    desc: {
        type: String,
        default: ''
    },
    // 资源时间
    time: {
        type: Date,
        default: new Date()
    },
    // 视频1， 图片2
    resType: {
        type: String,
        default: 'vedio'
    },
    // 关联字段，所属分类
    category: {
        //类型
        type: mongoose.Schema.Types.ObjectId,
        //引用
        ref: 'Category'
    },
    contents: {
        type: String,
        default: ''
    },
    // 相关视频
    next: {
        type: String,
        default: ''
    }
});