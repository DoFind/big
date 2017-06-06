/**
 * Created by cc on 2017/6/1.
 */

var mongoose = require('mongoose');

// 定义用户表结构

module.exports = new mongoose.Schema({

    resourceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    },

    // 日后可能需要显示头像，所有这里存String 貌似不够
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reply: [{
        // 如果需要头像，这个也马虎不得
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        // 这个可以没有，content中一带而过
        to:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        // 回复@茶茶： 回复的内容
        content: String,
        likeCount: {
            type: Number,
            default: 0
        },
        time: {
            type: Date,
            default: new Date()
        }
    }],
    content: String,
    likeCount: {
        type: Number,
        default: 0
    },
    // 楼层数
    floor: {
        type: Number,
        default: 0
    },
    time: {
        type: Date,
        default: new Date()
        }
    });