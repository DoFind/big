/**
 * Created by cc on 2017/5/15.
 */

var mongoose = require('mongoose');

// 定义用户表结构

module.exports = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});