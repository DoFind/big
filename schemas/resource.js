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
    // 视频vedio， 图片album
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
    // 图片资源相关字段，组图的路径
    albumPath: {
        type: Array,
        default: []
    },

    // 视频资源相关信息字段
    // 海报，保存上传后图片的本地路径
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

    // 相关视频 这个路径是不是也得存俩啊
    next: {
        type: String,
        default: ''
    },
    pre: {
        type: String,
        default: ''
    }
});