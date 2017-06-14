/**
 * Created by cc on 2017/5/15.
 */

var express = require('express');
var router = express.Router();
var fs = require('fs');
var multiparty = require('multiparty');
var path = require('path');
var User = require('../models/user');
var Category = require('../models/category');
var Resource = require('../models/resource');
var Series = require('../models/series');

router.use(function (req, res, next) {
    if(!req.userInfo.isAdmin){
        res.send('对不起，您没有权限进入后台管理..');
        return;
    }
    next();
})


// 失败和成功的跳转
function error(req, res, msg ) {
    res.render('admin/error', {
        userInfo: req.userInfo,
        message: msg,
        url: '/admin/vedio'
    });
}
function success(req, res,  msg, toUrl) {
    // console.log(res);
    res.render('admin/success', {
        userInfo: req.userInfo,
        message: msg,
        url: toUrl
    });
}


/*
* 首页
* */
router.get('/', function (req, res) {

    res.render('admin/index', {
        userInfo: req.userInfo
    })
})

/*
* 用户管理
* */
router.get('/user', function (req, res) {

    /*
     * 从数据库中读取所有的用户数据
     *
     * limit(Num) : 限制获取的数据条数
     *
     * skip(Num) : 忽略数据的条数
     *
     * 每页显示2条
     * 1 : 1-2 skip:0 -> (当前页-1) * limit
     * 2 : 3-4 skip:2
     * */

    var page = Number(req.query.page || 1);
    var pages = 0;
    var limit = 10;
    var skip = 0;

    User.count().then(function (count) {

        // 计算总页数
        pages = Math.ceil(count / limit);
        // 页数限制
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        // 计算skip
        skip = ( page - 1 ) * limit;

        User.find().limit(limit).skip(skip).then(function (users) {
            res.render('admin/user', {
                userInfo: req.userInfo,
                users: users,

                page: page,
                pages: pages,
                limit: limit,
                count: count
            })
        })
    })
})

/*
* 分类管理首页信息返回
* */
function getCategory(req, res, bShow, bSuc, message) {

    bShow = bShow || false;
    bSuc = bSuc || false;
    message = message || '';

    var page = Number(req.query.page || 1);
    var pages = 0;
    var limit = 10;
    var skip = 0;

    Category.count().then(function (count) {

        // 计算总页数
        pages = Math.ceil(count / limit);
        // 页数限制
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        // 计算skip
        skip = ( page - 1 ) * limit;

        Category.find().sort({resType: 1}).limit(limit).skip(skip).then(function (categories) {

            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories: categories,

                page: page,
                pages: pages,
                limit: limit,
                count: count,

                bShow: bShow,
                bSuc: bSuc,
                message: message
            })
        })
    })
}

/*
* 分类管理 -- 分类首页
* */
router.get('/category', function (req, res) {

    getCategory(req, res);
})


/*
 * 分类管理 -- 新增分类
 * */
router.get('/category/add', function (req, res) {

    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
})

router.post('/category/add', function (req, res) {

    var name = req.body.name.replace(/(^\s*)|(\s*$)/g, "") || '';
    var resType = req.body.resType;

    if (name == '') {
        res.render('admin/category_add', {
            userInfo: req.userInfo,
            bShow: true,
            isSuc: false,
            message: '分类名称不能为空..'
        });
        return;
    }

    //分类名称是否已存在
    Category.findOne({
        name: name,
        resType: resType
    }).then(function (category) {
        if(category) {
            res.render('admin/category_add', {
                userInfo: req.userInfo,
                bShow: true,
                isSuc: false,
                message: '分类信息已存在..'
            });
            return Promise.reject();
        }
        else {
            return new Category({
                name: name,
                resType: resType
            }).save();
        }
    }).then(function () {

        getCategory(req, res, true, true, '分类信息保存成功');

        /*res.render('admin/category_index', {
            userInfo: req.userInfo,
            isSuc: true,
            message: '分类信息保存成功'
        })*/
    })
})

/*
 * 分类管理 -- 修改分类
 * */
router.get('/category/edit', function (req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';

    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function (category) {

        if(category){
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                bShow: true,
                isSuc: false,
                message: '分类信息不存在..'
            });
        }
    })
})

router.post('/category/edit', function (req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';

    //获取post提交过来的名称 body拿到的是表单中 name='name' 的value！！！！！！！
    var name = req.body.name.replace(/(^\s*)|(\s*$)/g, "") || '';
    var resType = req.body.resType;

    if (name == '' || resType == '') {
        res.render('admin/category_edit', {
            userInfo: req.userInfo,
            bShow: true,
            isSuc: false,
            message: '分类信息不能为空..'
        });
        return;
    }

    //要修改的分类信息是否存在
    Category.findOne({
        _id: id
    }).then(function (category) {

        if(!category) {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                bShow: true,
                isSuc: false,
                message: '分类信息不存在..'
            });
            return Promise.reject();
        }
        else {

            if (name == category.name && resType == category.resType) {

                // 这么调用没有反应
                // getCategory(req, res, true, true, '分类名称修改成功');
                res.render('admin/category_edit', {
                    userInfo: req.userInfo,
                    bShow: true,
                    isSuc: false,
                    message: '分类信息不曾改变..'
                });
                return Promise.reject();
            }
            else {

                //查询看看 修改后的分类名称是否已经存在
                return Category.findOne({
                    _id: {$ne: id},
                    name: name,
                    resType: resType
                });
            }
        }
    }).then(function (sameCategory) {

        if (sameCategory) {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                bShow: true,
                isSuc: false,
                message: '该分类名称已存在..'
            });
            return Promise.reject();
        }
        else {
            // update  参数1 要修改谁； 参数2 改成什么
            return Category.update({ _id: id },{ name: name, resType: resType });
        }
    }).then(function () {

        getCategory(req, res, true, true, '分类名称修改成功');
    })
})

/*
* 分类管理 -- 分类删除
* */
router.get('/category/delete', function (req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';

    //获取要修改的分类信息
    Category.remove({
        _id: id
    }).then(function () {

        getCategory(req, res, true, true, '删除分类成功');
        /*res.render('admin/category_index', {
            userInfo: req.userInfo,
            isSuc: true,
            message: '删除分类成功'
        });*/
    })
})


/*
* 图片管理 -- 返回所有图片信息
* */
router.get('/album', function (req, res) {

    Resource.find({
        resType: 'album'
    }).populate(['category']).sort({ time: -1}).then(function (resources) {

        res.render('admin/album_index', {
            userInfo: req.userInfo,
            resources: resources
        });
    })
})

/*
* 图片上传页面
* */
router.get('/album/add', function (req, res) {

    Category.find({resType: 'album'}).then(function (categories) {

        res.render('admin/album_add', {
            userInfo: req.userInfo,
            categories: categories
        });
    })
})

router.post('/album/add', function(req, res, next){

    // 生成multiparty对象，配置上传目标路径
    var dirpath = './public/img/photobook/';
    var form = new multiparty.Form({uploadDir: dirpath});

    form.parse(req, function (err, fields, files) {

        var paths = files.path;

        if( paths.length > 0 ){

            var filenames = [];
            var len = paths.length;
            var index = 0;

            for(var i=0; i<len; i++){

                var posterData = paths[i];
                var filename = Date.now() + '-' + posterData.originalFilename;
                filenames.push(filename);

                //重命名文件名
                fs.rename(posterData.path, dirpath + filename, function(err) {
                    if(err){
                        console.log('rename failed');
                    }
                });
            }
            req.albumPath = filenames;
            req.fields = fields;
            next();
        }
        else{
            req.fields = fields;
            console.log('no files');
            next();
        }
    })

},
    function(req, res){

    var data = req.fields;
    var title = data.title || '';
    var time = data.time || null;
    var category = data.category || '';
    var summary = data.summary || '';
    var albumPath = req.albumPath || [];

    //信息非空验证
    if(title == '' || summary == '' || time == null || category == '' || albumPath.length == 0){

        error(req, res,  '请填写全部信息..');
        return;
    }

    // 信息保存
    // 单条信息保存

    Resource.findOne({
        title: title,
        time: time,
        resType: 'album'
    }).then(function (re) {
        if(re) {
            error(req, res,  '该图集信息已存在..')
            return Promise.reject();;
        }
        else {
            return new Resource({
                title: title,
                summary: summary,
                time: time,
                resType: 'album',
                category: category,
                albumPath: albumPath
            }).save();
        }
    }).then(function () {

        success(req, res,  '图片上传成功', '/admin/album');
    })
})

/*
* 图片修改
* */
router.get('/album/edit', function (req, res) {

    var id = req.query.id || '';

    if(id == ''){
        error(req, res,  '修改的相册不存在');
        return;
    }

    var categories = [];

    Category.find({resType: 'album'}).then(function (re){

        categories = re;
        return Resource.findOne({
            _id: id
        }).populate('category');
    }).then(function (album) {

        if(album){
            res.render('admin/album_edit', {
                userInfo: req.userInfo,
                categories: categories,
                album: album
            });
        }
        else{
            error(req, res,  '修改的相册不存在');
        }
    })
})

router.post('/album/edit', function (req, res) {

    // 上传为上， 修改自己注意吧  别传错啊
    var data = req.body;
    var id = req.query.id;

})

/*
* 图片删除
* */
router.get('/album/delete', function (req, res) {

    var id = req.query.id || '';

    if (id == ''){
        error(req, res,  '要删除的图集不存在..');
        return;
    }
    // 获取要修改的分类信息
    // 也应该删除云端的图片啊
    Resource.remove({
        _id: id
    }).then(function () {
        success(req, res,  '成功删除图片', '/admin/album');
    })
})

/*
 * 视频管理
 * */
router.get('/vedio', function (req, res) {

    Resource.find({
        resType: {$in: ['vedio', 'vgroup']}
    }).populate(['category']).sort({ category: -1}).then(function (resources) {

        res.render('admin/vedio_index', {
            userInfo: req.userInfo,
            resources: resources
        });
    })
})

/*
 * 视频上传页面
 * */
router.get('/vedio/add', function (req, res) {

    Category.find({resType: 'vedio'}).then(function (categories) {

        res.render('admin/vedio_add', {
            userInfo: req.userInfo,
            categories: categories
        });
    })
})

router.post('/vedio/add', function(req, res, next){

    // 生成multiparty对象，配置上传目标路径
    var form = new multiparty.Form({uploadDir: './public/img/poster/'});

    form.parse(req, function (err, fields, files) {

        if( files.poster.length > 0 ){

            var posterData = files.poster[0];
            var filename = Date.now() + '-' + posterData.originalFilename;
            var newPath = './public/img/poster/' + filename;

            //重命名文件名
            fs.rename(posterData.path, newPath, function(err) {
                if(err){
                        req.fields = fields;
                        console.log('rename error: ' + err);
                        next();
                    } else {
                        req.poster = filename;
                        req.fields = fields;
                        next();
                    }
                });
        }
        else{
            req.fields = fields;
            console.log('no files');
            next();
        }
    })
},
    function(req, res){

    var data = req.fields;

    // 标题、简介、时间、分类、海报
    var title = data.title || '';
    var summary = data.summary || '';
    var time = data.time || null;
    var category = data.category || '';
    var poster = req.poster || '';
    // 视频资源类型  vedio  vgroup
    var resType = data.resType[0] || '';
    // 是否为主线  radio值为数组，arr[0]为选中的辣一个
    var bTimeline = data.timeline[0] == 'true' ? true : false;

    // 片源地址 不能同时为空
    var path = data.path ||'';
    var flash = data.flash || '';
    var bili = data.bili || '';


    //信息验证  海报暂时不验证
    if(title == '' || summary == '' || time == null || category == '' || resType == ''){

        error(req, res,  '请填写完整信息..');
        return;
    }
    if(resType == 'vedio' && path == '' && flash == '' && bili == ''){

        error(req, res,  '请填写完整信息..');
        return;
    }

    // 信息保存
    // 单条信息保存
    Resource.findOne({
        title: title,
        time: time,
        resType: resType
    }).then(function (re) {

        if(re) {
            error(req, res,  '该视频信息已存在..');
            return Promise.reject();
        }
        else {
            return new Resource({
                title: title,
                summary: summary,
                time: time,
                resType: resType,
                category: category,
                poster: poster,
                path: path,
                flash: flash,
                bili: bili,
                bTimeline: bTimeline
            }).save();
        }
    }).then(function () {
        success(req, res,  '视频上传成功', '/admin/vedio');
    })
})

/*
* 视频修改页面
* */
router.get('/vedio/edit', function (req, res) {

    var id = req.query.id || '';

    if(id == ''){
        error(req, res,  '修改的视频不存在');
        return;
    }

    var categories = [];

    Category.find({resType: 'vedio'}).then(function (re){

        categories = re;
        return Resource.findOne({
            _id: id
        }).populate('category');
    }).then(function (vedio) {

        if(vedio){
            res.render('admin/vedio_edit', {
                userInfo: req.userInfo,
                categories: categories,
                vedio: vedio
            });
        }
        else{
            error(req, res,  '修改的视频不存在');
        }
    })
})

router.post('/vedio/edit', function (req, res) {

    var data = req.body;
    var id = data.vedioID;
    var resType = data.resType;

    // 标题、简介、时间、所属分类、海报地址
    // var title = data.title || '';
    var summary = data.summary || '';
    var time = data.time || null;
    var category = data.category || '';
    var poster = data.poster || '';
    // 视频资源地址 如果是视频组可以不填
    var path = data.path ||'';
    var flash = data.flash || '';
    var bili = data.bili || '';

    //信息非空验证
    if(summary == '' || time == null || category == '' || poster == ''){

        error(req, res,  '请填写完整信息..');
        return;
    }
    if(resType == 'vedio' && path == '' && flash == '' && bili == ''){

        error(req, res,  '请填写完整信息..');
        return;
    }

    Resource.update({
        _id: id
    }, {
        //title: title,
        summary: summary,
        time: time,
        category: category,
        poster: poster,
        path: path,
        flash: flash,
        bili: bili
    }).then(function () {
        success(req, res,  '视频修改成功', '/admin/vedio');
    })
})

/*
* 系列视频 管理
* */
router.get('/vgroup', function (req, res) {

    // 主视频parentID，借此查找所有子视频
    var parentID = req.query.id || '';

    Series.find({
        parentRes: parentID
    }).sort({ time: -1}).then(function (series) {

        res.render('admin/vgroup_index', {
            userInfo: req.userInfo,
            series: series
        });
    })
})

/*
* 系列视频 上传
* */
router.get('/vgroup/add', function (req, res) {

    // 把类型为vgroup的资源名查出来返回
    Resource.find({
        resType: 'vgroup'
    }, {'_id':1, 'title':1}).then(function ( groups ) {

        res.render('admin/vgroup_add', {
            userInfo: req.userInfo,
            groups: groups
        });
    })
})

router.post('/vgroup/add', function (req, res) {

    var data = req.body;

    // 标题、简介、时间、列表显示名
    var title = data.title || '';
    var summary = data.summary || '';
    var time = data.time || null;
    var listTitle = data.listTitle || title;
    // 片源地址
    var path = data.path ||'';
    var flash = data.flash || '';
    var bili = data.bili || '';
    // 标签
    var tag = data.tag || '';
    // 父级资源ID
    var parentRes = data.parentRes;

    //信息验证
    if( title == '' || summary == '' || time == null || listTitle == ''){

        error(req, res,  '请填写完整信息..');
        return;
    }
    if( path == '' && flash == '' && bili == ''){
        error(req, res,  '视频至少需要一个路径..');
        return;
    }

    // 数据写入series表中  尤其注意parentID
    Series.findOne({title: data.title}).then(function (re) {
        if(re){
            error(req, res, '资源已存在');
            return Promise.reject();
        }
        else{
            return new Series({
                title: title,
                summary: summary,
                time: time,
                path: path,
                flash: flash,
                bili: bili,
                parentRes: parentRes,
                tag: tag,
                listTitle: listTitle
            }).save();
        }
    }).then(function (re) {

        success(req, res, '数据插入成功', '/admin/vgroup?id='+parentRes);
    })
})

/*
* 系列视频修改
* */
router.get('/vgroup/edit', function (req, res) {
    
    var id = req.query.id;
    
    Series.findOne({_id: id}).then(function (re) {

        if(re){
            res.render('admin/vgroup_edit', {
                userInfo: req.userInfo,
                series: re
            })
        }
        else{
            error(req, res,  '资源不存在');
            return;
        }
    })
})

router.post('/vgroup/edit', function (req, res) {

    var data = req.body;
    var id = req.query.id;

    // 标题、简介、时间、列表显示名
    var title = data.title || '';
    var summary = data.summary || '';
    var time = data.time || null;
    var listTitle = data.listTitle || title;
    // 片源地址
    var path = data.path ||'';
    var flash = data.flash || '';
    var bili = data.bili || '';
    // 标签
    var tag = data.tag || '';

    //信息验证
    if( title == '' || summary == '' || time == null || listTitle == ''){

        error(req, res,  '请填写完整信息..');
        return;
    }
    if( path == '' && flash == '' && bili == ''){
        error(req, res,  '视频至少需要一个路径..');
        return;
    }

    Series.update({
        _id: id
    }, {
        title: title,
        summary: summary,
        time: time,
        path: path,
        flash: flash,
        bili: bili,
        tag: tag,
        listTitle: listTitle
    }).then(function () {
        success(req, res,  '视频修改成功', '/admin/vgroup?id='+data.parentRes);
    })
})

/*
* 视频删除
* */
router.get('/vedio/delete', function (req, res) {

    var id = req.query.id || '';

    if (id == ''){
        error(req, res,  'ID为空，资源不存在..');
        return;
    }

    // 获取要修改的分类信息
    // 也要删除云端的海报图，不然占着空间
    // 或者留着，在修改海报的时候从云端读取

    Series.remove({ parentRes: id }).then(function () {

        Resource.remove({ _id: id }).then(function () {
            success(req, res,  '成功删除视频', '/admin/vedio');
        })
    })
})

router.get('/vgroup/delete', function (req, res) {

    var id = req.query.id || '';

    if(id == ''){
        error(req, res,  'ID为空，资源不存在..');
        return;
    }

    Series.remove({
        _id: id
    }).then(function () {
        success(req, res,  '删除成功', '/admin/vedio');
    })
})

// 对外暴露
module.exports = router;