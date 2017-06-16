$(function() {

    /*
    * 用户信息相关： 注册、登录、退出登录
    * */
    $loginBox = $('#login');
    $registerBox = $('#register');

    /*
     * 登录
     * */
    $loginBox.find('.login').click(function() {

        // 通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username:$loginBox.find('.username').val(),
                password:$loginBox.find('.password').val()
            },
            dataType: 'json',
            success: function (res) {
                $loginBox.find('.colWarning').html(res.msg);

                if (!res.code) {
                    window.location.reload();
                }
            }
        })
    })


    /*
    * 注册
    * */
    $registerBox.find('.register').click(function () {
        // 通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username:$registerBox.find('.username').val(),
                password:$registerBox.find('.password').val(),
                repassword:$registerBox.find('.repassword').val()
            },
            dataType: 'json',
            success: function (res) {

                $registerBox.find('.colWarning').html(res.msg);

                if (!res.code) {
                    //注册成功
                    window.location.reload();
                }

            }
        });
    })

    /*
     * 退出登录
     * */
    $('#logout').click(function () {
        $.ajax({
            type: 'get',
            url: '/api/user/logout',
            success: function (res) {

                if (!res.code) {
                    window.location.reload();
                }
            }
        });
    })


    /*
    * 表白
    * */
    var $loveBox = $('#loveBox');

    $loveBox.find('.loveBtn').click(function () {
        // 通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/main/lover',
            data: {
                content: $loveBox.find('.content').val()
            },
            dataType: 'json',
            success: function (res) {

                if (!res.code) {
                    window.location.reload();
                }
                else {
                    $loveBox.find('.colWarning').html(res.msg);
                }
            }
        });
    });


    /*
    * 鼠标滑过  表白墙显示详情
    * */

    var $lovewall = $('#lovewall');

    // prompt 提示框
    var oPrompt = $('.loveword_info');
    var oImg = oPrompt.find('img');
    var oName = oPrompt.find('h4');
    var oP = oPrompt.find('p');

    $lovewall.find('img').hover(function() {

        // 显示确定位置
        var pos = $(this).parent().position();
        var iTop = pos.top - 10;
        var iLeft = pos.left + 60;
        oPrompt.show().css({ 'left': iLeft, 'top': iTop });

        // 赋值
        oImg.attr('src', $(this).attr('src'));
        oName.text($(this).attr('name'));
        oP.text($(this).attr('content'));

    }, function () {
        oPrompt.hide();
    });

    /*
    * 返回顶部  原则上显示内容超过一页才有这个按钮，某些页面不显示
    * */
    $('#scrollTop').click(function(){
        $('html,body').animate({scrollTop: '0px'}, 300);
    });
});
