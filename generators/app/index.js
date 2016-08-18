'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  init: function () {
    //初始化

  },
  prompting: function () {
    //和用户交互的时候（命令行问答之类的）调用

    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the peachy ' + chalk.red('generator-fallen-angel') + ' generator!'
    ));


    var questionlist = require('../app/question');
    var index = 0;
    var config = {};
    var me = this;
    genQuestion(function () {
      me.props = config;
      done();
    });

    function genQuestion(callback) {
      if (index < questionlist.length) {
        initQustion(questionlist[index], function () {
          genQuestion(callback)
        });
        index++;
      } else {
        callback && callback();
      }
    }

    function initQustion(option, callback) {
      return me.prompt([{
        name: option.name,
        message: option.message
      }]).then(function (answers) {
        for (var key in answers) {
          config[key] = answers[key];
        }
        callback && callback();
      })
    }

  },

  writing: function () {

    //创建目录
    this.mkdir('build');
    this.mkdir('libs');
    this.mkdir('src/img');

    //复制文件
    this.fs.copyTpl(this.templatePath('_gulpfile.js'), this.destinationPath('gulpfile.js'));
    this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), this.props);
    this.fs.copyTpl(this.templatePath('_webpack.config.js'), this.destinationPath('webpack.config.js'));
    this.fs.copyTpl(this.templatePath('_README.md'), this.destinationPath('README.md'));
    this.fs.copyTpl(this.templatePath('_index.html'), this.destinationPath('src/index.html'));
    this.fs.copyTpl(this.templatePath('_index.less'), this.destinationPath('src/less/_index.less'));
    this.fs.copyTpl(this.templatePath('_index.es6'), this.destinationPath('src/es6/index.es6'));
    this.fs.copyTpl(this.templatePath('_test.es6'), this.destinationPath('src/es6/test.es6'));


  },

  install: function () {
    this.installDependencies({bower: false});
  }
});
