
$(function () {
    // 回复别人的评论
    $('.comment-list').on('click', '.reply', function () {

        var target = $(this);
        var toID = target.data('tid');
        var commentID = target.data('cid');

        // console.log(toID);
        // console.log(commentID);

        //插入隐藏域  .textarea-container
        if($('#toID').length > 0){
            $('#toID').val(toID);
        }
        else{
            $('<input>').attr({
                type: 'hidden',
                id: 'toID',
                value: toID
            }).appendTo('.textarea-container');
        }

        if($('#commentID').length > 0){
            $('#commentID').val(commentID);
        }
        else{
            $('<input>').attr({
                type: 'hidden',
                id: 'commentID',
                value: commentID
            }).appendTo('.textarea-container');
        }

        // 插入回复框reply-send
        /*var htmlList = '',
            // 模板HTML
            htmlTemp = $("#template-reply").html();

        laytpl(htmlTemp).render({}, function(html){
            $(".reply-send").empty().append(html);
        });*/
    })

    // 提交评论
    $('#commentBtn').click(function () {
        $.ajax({
            type: 'post',
            url: '/comments/reply',
            data: {
                resourceID:$('#resourceID').val(),
                content:$('#mainReply').val(),
                toID: $('#toID').length>0 ? $('#toID').val() : null,
                commentID: $('#commentID').length>0 ? $('#commentID').val() : null
            },
            dataType: 'json',
            success: function (comments) {

                $('#mainReply').val('');
                // console.log('html--评论返回');
                // console.log(comments);
                renderComment(comments);
            }
        });
    })
});

// 显示评论列表啦
function renderComment(comments) {

    var len = comments.length;

    if ( len > 0 ){
        // 总评论条数
        $('.result').html(comments.length);

        var htmlList = '',
            // 模板HTML
            htmlTemp = $("#template-list").html();

        comments.forEach(function (item) {
            laytpl(htmlTemp).render(item, function(html){
                htmlList += html;
            });
        })
        // 添加到页面
        $(".comment-list").empty().append(htmlList);
    }
}

//每次页面重载的时候获取一下该文章的所有评论
$.ajax({
    url: '/comments/list',
    data: {
        resourceID: $('#resourceID').val()
    },
    success: function(comments) {
        // console.log('html--页面重载');
        // console.log(comments);
        renderComment(comments);
    }
});