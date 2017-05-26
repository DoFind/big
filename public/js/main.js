$(function() {

    /*
    * 用户信息相关： 注册、登录、退出登录
    * */
    $loginBox = $('#login');
    $registerBox = $('#register');


    /*
     * 登录
     * */
    $loginBox.find('.close').on('click', function () {
        $loginBox.hide();
    })
    $loginBox.find('.login').on('click', function () {

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

                    $loginBox.hide();
                    window.location.reload();
                }
            }
        })
        
    })


    /*
    * 注册
    * */
    $registerBox.find('.close').on('click', function () {
        $registerBox.hide();
    })
    $registerBox.find('.register').on('click', function () {

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
                    $registerBox.hide();
                    window.location.reload();
                }

            }
        });
    });

    /*
     * 退出登录
     * */
    $('#logout').on('click', function () {
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
    * 主页宣传栏轮播
    * */

});
