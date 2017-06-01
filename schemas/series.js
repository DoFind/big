/**
 * Created by cc on 2017/5/31.
 *
 * 系列视频的 单个视频
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({

    // 父级资源
    parentRes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    },

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

    // 访问量
    playCount: {
        type: Number,
        default: 0
    },
    // 赞数量
    supportCount: {
        type: Number,
        default: 0
    }
});