/**
 * Created by cc on 2017/6/1.
 * 评论..
 */

var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Resource = require('../models/resource');
var Series = require('../models/series');
var Comments = require('../models/comments');

router.get('/list', function (req, res) {

    var id = req.query.resourceID || '';

    if(id){
        // 评论数据返回
        Comments.find({resourceID: id}).populate(['from', 'reply.from', 'reply.to']).sort({time: -1}).then(function (comments) {
            // console.log("ajax 刷新页面返回");
            // console.log(comments);
            res.json(comments);
        });
    }
    else{
        console.log('资源不存在');
    }
})

// 评论噢
router.post('/reply', function (req, res) {

    var resourceID = req.body.resourceID;
    var from = req.userInfo._id;
    var content = req.body.content;
    var toID = req.body.toID;
    var commentID = req.body.commentID;

    // console.log('start');
    // console.log(resourceID);
    // console.log(from);
    // console.log(content);
    // console.log(toID);
    // console.log(commentID);


    if(commentID){

        var reply = [];
        // 找到commentID 把新的回复save
        Comments.findOne({_id: commentID}).then(function (comment) {

            comment.reply.unshift({
                from: from,
                to: toID,
                content: content,
                time: Date.now()
            });

            return comment.save();

        }).then(function (re) {

            console.log('re');
            console.log(re);
            // 查询当前resourceID下的所有评论
            Comments.find({resourceID: resourceID}).populate(['from', 'reply.from', 'reply.to']).sort({time: -1}).then(function (comments) {
                console.log('评论之后返回数据');
                console.log(comments.reply);
                res.json(comments);
            })
        });
    }
    else{
        // comments 中是一条评论   同一resourceID对应多条评论  楼层数递增应该在外部统计...麻烦
        // Resource 中记录当前总评论数floor
        Resource.findOne({_id: resourceID}).then(function (re) {

            if(re){
                return Resource.update({_id: resourceID}, {$inc: {floor: 1}}).then(function (re) {

                    if (re){
                        return Resource.findOne({_id: resourceID}, 'floor').then(function (re) {

                            if(re){
                                // 保存当前评论
                                return new Comments({
                                    resourceID: resourceID,
                                    from: from,
                                    content: content,
                                    floor: re.floor,
                                    time: Date.now()
                                }).save();
                            }
                            else{
                                console.log('resource 查询未果');
                                return Promise.reject();
                            }
                        })
                    }
                    else {
                        console.log('update failed');
                        return Promise.reject();
                    }
                })
            }
            else {
                return Series.update({_id: resourceID}, {$inc: {floor: 1}}).then(function (re) {

                    if(re){
                        return Series.findOne({_id: resourceID}, 'floor').then(function (re){

                            if (re){

                                // 保存当前评论
                                return new Comments({
                                    resourceID: resourceID,
                                    from: from,
                                    content: content,
                                    floor: re.floor,
                                    time: Date.now()
                                }).save();
                            }
                            else{
                                console.log('series 数据未查到')
                                return Promise.reject();
                            }
                        });
                    }
                    else{
                        console.log('update failed');
                        return Promise.reject();
                    }
                })
            }
        }).then(function () {

            // 查询当前resourceID下的所有评论
            Comments.find({resourceID: resourceID}).populate(['from', 'reply.from', 'reply.to']).sort({time: -1}).then(function (comments) {
                // console.log('评论之后返回数据');
                res.json(comments);
            })
        })
    }
})

module.exports = router;