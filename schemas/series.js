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
    // bilibili地址
    bili: {
        type: String,
        default: ''
    },
    // 访问量
    PV: {
        type: Number,
        default: 0
    },
    // 楼层数
    floor: {
        type: Number,
        default: 0
    },
    // 赞数量
    likeCount: {
        type: Number,
        default: 0
    },
    // 标签
    tag: {
        type: String,
        default: ''
    },
    // 列表显示名
    listTitle: {
        type: String,
        default: ''
    }
});