

/*String.prototype.temp = function(obj) {
    return this.replace(/\$\w+\$/gi, function(matchs) {
        var str = obj[matchs.replace(/\$/g, "")];
        return (str + "") == "undefined"? "": str;
    });
};*/

// 回复别人的评论
$('.replyyyyy').on('click', function (e) {

    console.log('click!!!!');
    var target = $(this);
    var toID = target.data('tid');
    var commentID = target.data('cid');
    console.log(toID);
    console.log(commentID);

    //插入隐藏域  .textarea-container

})

$('#commentBtn').on('click', function () {
    $.ajax({
        type: 'post',
        url: '/comments/reply',
        data: {
            resourceID:$('#resourceID').val(),
            content:$('#mainReply').val()
        },
        dataType: 'json',
        success: function (comments) {

            $('#mainReply').val('');
            console.log('html--评论返回');
            console.log(comments);
            renderComment(comments);
        }
    });
})

//每次页面重载的时候获取一下该文章的所有评论
$.ajax({
    url: '/comments/list',
    data: {
        resourceID: $('#resourceID').val()
    },
    success: function(comments) {
        console.log('html--页面重载');
        //console.log(comments);
        renderComment(comments);
    }
});


function renderComment(comments) {

    var len = comments.length;
    var htmlList = '';
    if ( len > 0 ){
        // 总评论条数
        $('.result').html(comments.length);

        // 生成评论列表
        comments.forEach(function (item) {
            // console.log('遍历');
            // console.log(item);

            // var time = item.time | date('Y-m-d h:m:s', -8*60);
            // console.log(time);

            // 二级回复
            /*var replyList = "";
            if (item.reply.length > 0){

                item.reply.forEach(function (r) {

                    replyList += '<div class="list-item reply-wrap">' +
                        '<div class="user-face"><img class="user-head" src="/public/img/res/cat02.png" alt="user"></div>' +
                        '<div class="reply-con">' +
                        '<div class="user">' +
                            '<span class="name">'+ r.from.username +'</span>' +
                            '<span class="text-con">回复'+ r.to.username +':'+ r.content +'</span></div>' +
                        '<div class="info">' +
                            '<span class="time">'+ r.time +'</span>' +
                            '<span class="like"><i class="glyphicon glyphicon-thumbs-up"></i><span>&nbsp;('+ r.likeCount +')</span>' +
                            '<span class="reply btn-hover"><a href="#comment-send" data-cid='+ item._id +' data-tid='+ r.form_id +'>回复</a></span>' +
                        '</div></div></div>';
                });
            }*/

            htmlList += '<div class="list-item reply-wrap">' +
                '<div class="user-face">' +
                '<img class="user-head" src="/public/img/res/cat01.png" alt="user"></div>' +
                '<div class="con">' +
                '<div class="user"><span class="name">' + item.from.username + '</span></div>' +
                '<p class="text">' + item.content + '</p>' +
                '<div class="info">' +
                '<span class="floor">#' + item.floor + '</span>' +
                '<span class="time">' + item.time + '</span>' +
                //'<span class="like"><i class="glyphicon glyphicon-thumbs-up"></i><span>&nbsp;(' + item.likeCount + ')</span></span>' +
                //'<span class="reply btn-hover"><a class="replyyyyy" href="#comment-send" data-cid='+ item._id +' data-tid='+ item.from._id +'>回复</a></span>' +
                //'</div><div class="replybox">'+ replyList +'</div>' +
                '</div></div>';
        });
        // 添加到页面
        $(".comment-list").html(htmlList);
    }
}