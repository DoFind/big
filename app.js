/**
 * Created by cc on 2017/5/15.
 */

// 应用程序的启动（入口）文件

// 加载express模块
var express = require('express');
// 加载模板 分离前后端
var swig = require('swig');
// 加载数据库模块
var mongoose = require('mongoose');
// 加载body-parser，用来处理post提交数据
var bodyParser = require('body-parser');
// 加载cookies
var Cookies = require('cookies');
// 创建app应用 => NodeJs  Http.createServer()
var app = express();

/*
* 配置模板引擎
* 定义当前应用所使用的模板引擎
* 第一个参数：模板引擎的名称，同时也是文件后缀
* 第二个参数：解析处理模板内容的方法
 */
app.engine('html', swig.renderFile);

/*
* 设置模板文件存放的目录 参数1： 是固定的views 参数2： 路径
* */
app.set('views','./views');
/*
* 注册所使用的模板引擎  参数1 固定 参数2 engine中第一个参数
* */
app.set('view engine', 'html');
/*
* 开发过程中，需要取消模板缓存
* */
swig.setDefaults({cache: false});

/*
* 设置静态文件托管  css 和 js 文件
* 当用户访问的URL以/public开始，直接返回对应的__dirname+'/public'下的文件
* 这个是通过正则来判定的
* */
app.use('/public',express.static(__dirname+'/public'));

// bodyParser设置
// req中会增加一个body属性，ajax提交的data
// 誒，写在模块划分之前啊！！！！！！！！！！！！！！！！
app.use( bodyParser.urlencoded({extended: true}) );

// 配置cookies
app.use(function(req, res, next){

    req.cookies = new Cookies(req, res);

    // 解析登录用户的cookies信息，全局可用
    req.userInfo = {};
    if(req.cookies.get('userInfo')){
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'));
            next();
        }catch (e){
            next();
        }
    }
    else{
        next();
    }
})


/*
* 模块划分
* */
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));


// 监听http请求
// 连接数据库
mongoose.connect('mongodb://localhost:27018/blog', function (res) {
    if(res){
        console.log('连接失败');
    }else{
        console.log('连接成功');
        app.listen('8081');
    }
});

