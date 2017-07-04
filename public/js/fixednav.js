
/*
* 网页定位导航条  2017-06-14
* */

$(document).ready(function() {

    // 滚动条滚动事件
    $(window).scroll(function() {

        // 滚动条滚动距离顶部的距离
        var top = $(document).scrollTop();
        var menu = $('#growth-menu');

        // find的效率比下面的写法高
        var items = $('#growth-content').find('.item');
        // var items = $('#content .item');

        var currentId = ''; // #id

        items.each(function() {

            //这也是一个好习惯据说
            var m = $(this);

            var itemTop = m.offset().top;
            if (top > itemTop-200) {
                currentId = '#' + m.attr('id');
            }
            else {
                return false;
            }
        })

        //给相应楼层的a 设置currentId, 并取消其他楼层
        /*menu.find('a').removeClass('current');
        // 这里find href 的引号真是蜜汁重要啊
        menu.find("[href='" + currentId + "']").addClass('current');*/

        var currentLink = menu.find('.current');
        if (currentId && currentLink.attr('href') != currentId) {
            currentLink.removeClass('current');
            menu.find("[href='" + currentId + "']").addClass('current');
        }
    })
});