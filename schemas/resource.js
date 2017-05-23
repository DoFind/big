/**
 * Created by cc on 2017/5/15.
 */

var mongoose = require('mongoose');

// 定义分类表结构

module.exports = new mongoose.Schema({

    title: String,
    // 简介/摘要 summary
    summary: {
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
    // 海报
    poster: {
        type: String,
        default: ''
    },
    // 资源通用地址
    path: {
        type: String,
        default: ''
    },
    // 资源flash地址
    flash: {
        type: String,
        default: ''
    },
    // 相关视频
    next: {
        type: String,
        default: ''
    }
});