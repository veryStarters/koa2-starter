
## koa2-Starter(K2S)

### 安装

请预先安装 mongo，如有缓存需求，请安装redis，系统都已经内置对应数据库的访问功能

```
  npm i -g vue-cli
  
  vue init veryStarter/koa2-starter myProject
  
  cd myProject
  
  yarn install
  
  yarn start

```

###  使用

- 在controller中创建模块目录，并新建index.js文件，系统会自动生成index.js文件的基础框架模板，里面的每个export都将作为该模块的一个action，并自动路由到此

- 在models目录中创建模型文件，模型文件中定义schema，并导出为model，即可在controller或者business中使用

- pages目录可以用作一些简单的模板展示页面，在其中创建的html页面基于ejs模板引擎，可直接通过/filename进行访问






