$(function() {

    $loginBox = $('#login');
    $registerBox = $('#register');
    
    $('#loginBtn').on('click', function () {
        $loginBox.show();
    });

    $loginBox.find('.exit').on('click', function () {
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
                    // window.location.reload();
                }
            }
        })
        
    })



    $('#registerBtn').on('click', function () {
        $registerBox.show();
    });
    $registerBox.find('.exit').on('click', function () {
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
                    setTimeout(function() {
                        $loginBox.show();
                        $registerBox.hide();
                    }, 500);
                }

            }
        });
    });



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
