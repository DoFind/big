/**
 * Created by cc on 2017/6/6.
 */

var mongoose = require('mongoose');

// 定义用户表结构

module.exports = new mongoose.Schema({

    // 谁说的
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // 简短标题
    title: String,
    // 内容
    content: String,
    // 楼层数
    floor: {
        type: Number,
        default: 0
    },
    // 时间戳
    time: {
        type: Date,
        default: new Date()
        }
    });