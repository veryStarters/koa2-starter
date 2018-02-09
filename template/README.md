#Koa2-Starter

###Koa2-starter是什么？

koa2-starter是一个简单但不简约的koa2脚手架。它集成了koa-router, koa-body, koa-static,
koa-views, mongodb, websocket等常用功能模块，且对koa-router进行了自动化封装，提供了dispatcher功能，
仅需要在controllers目录中创建对应的模块，系统将自动路由

### Get Start

依赖mongo，请先安装mongodb；如有缓存需求，请安装redis，系统已经内置针对redis的访问功能

```
  npm i -g vue-cli   // 如已经安装请忽略
  
  vue init veryStarters/koa2-starter myProject
  
  cd myProject
  
  yarn install
  
  yarn start
  
  yarn deploy  // 采用pm2部署

```
在浏览器中输入http://localhost:9090即可访问

### 目录结构

.
├── build               // 系统编译及辅助功能模块
│   └── templates
├── logs                // 日志文件
└── src
    ├── business        // 业务逻辑
    │   └── user
    ├── controllers     // 控制器
    │   ├── test
    │   └── user
    ├── middlewares     // 中间件
    ├── models          // 模型，使用mongo orm
    ├── pages           // 模板文件，不建议使用，实在有需要可以简单
    │   └── user
    ├── static          // 静态资源
    │   └── lib
    └── utils           // 工具类
    
###  开发流程及注意事项

1、在controllers中创建模块文件夹，如user，在其中创建index.js文件，稍等片刻，系统会自动创建index.js文件的基本骨架

2、在models中创建任何一个js文件，都会自动填充以该文件所在目录层级命名的model骨架

2、在index.js文件中，默认包含了增删查改四个action的基本框架，可选择使用，如无需对应接口，则删除改action即可

3、接口默认访问规则为/api/:module/:action, 如上述user, 要想访问add接口，接口地址为/api/user/add

4、若有自定义访问规则，则修改对应action为一个对象，其中包含route，method和action等属性，具体请参见user/info这个action

5、若接口有权限校验需求，可在config.js中配置needAuth为TRUE，并在middleswares/auth.js文件中统一处理对应的权限，不建议在每个action单独处理

    
    
