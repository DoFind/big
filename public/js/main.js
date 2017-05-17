$(function() {

    /*
    * 用户信息相关： 注册、登录、退出登录
    * */
    $loginBox = $('#login');
    $registerBox = $('#register');
    $rightNav = $('#rightNav');


    /*
     * 登录
     * */
    $rightNav.find('.login').on('click', function () {
        $loginBox.show();
    })

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
                    /*
                    $rightNav.find('.login').hide();
                    $rightNav.find('.register').hide();
                    $rightNav.find('.userinfo').show();

                    // 显示用户信息
                    $rightNav.find('.userinfo>a').html(res.userInfo.username);*/

                    $loginBox.hide();
                    window.location.reload();
                }
            }
        })
        
    })


    /*
    * 注册
    * */
    $rightNav.find('.register').on('click', function () {
        $registerBox.show();
    });
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
    $rightNav.find('.logout').on('click', function () {
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
    * 主页内容相关
    *
    * */
    var ad = $('#ad');

    var pic = ad.find('.picList').find('li');
    var state = ad.find('.stateList').find('li');

    var index = 0;
    var len = 5;

    // init
    pic.hide();
    pic.eq(0).show();
    state.css('background', '');
    state.eq(0).css('background', 'red');

    //prev
    ad.find('.prev').on('click', function() {

        index--;
        if (index < 0) index = 4;
        pic.hide();
        pic.eq(index).show();

        state.css('background', '');
        state.eq(index).css('background', 'red');

    });

    ad.find('.next').on('click', function() {
        index++;
        if (index >= len) index = 0;
        pic.hide();
        pic.eq(index).show();

        state.css('background', '');
        state.eq(index).css('background', 'red');
    })

});
