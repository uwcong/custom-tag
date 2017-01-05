/**
 * 顶栏和边栏
 * @author Cc
 * @date 2016/12/14
 */
var TopSidebar = {
  // 边栏配置
  sidebarConfig: [
    {
      li1: '市场概况',
      li1Fa: 'fa-table',
      li2List: [
        {
          li2: '市场日概况',
          li2Url: '#1'
        }
      ]
    },
    {
      li1: '运营概况',
      li1Fa: 'fa-table',
      li2List: [
        {
          li2: '运营所有游戏概况',
          li2Url: '#2'
        },
        {
          li2: '运营单个游戏概况',
          li2Url: '#3'
        },
        {
          li2: '运营游戏区概况',
          li2Url: '#4'
        },
        {
          li2: '运营游戏包卸载概况',
          li2Url: '#5'
        },
        {
          li2: '储值概况',
          li2Url: '#6'
        },
        {
          li2: '订单实时概况',
          li2Url: '#7'
        },
        {
          li2: '坏账订单概况',
          li2Url: '#8'
        }
      ]
    }
  ],

  /**
   * public function 初始化组件
   * @author Cc
   */
  init: function() {
    var that = this;

    var proto = Object.create(HTMLElement.prototype);
    // 创建元素实例回调
    proto.createdCallback = function() {
      // console.log("createdCallback");
      var sbli1Index = this.getAttribute('data-sbli1Index');
      var sbli2Index = this.getAttribute('data-sbli2Index');


      var logoTemp = '<div class="navbar-header col-md-2"><a class="navbar-brand" href="index.html"><strong>MIN</strong>IMAL</a><div class="sidebar-collapse"><a href="#"><i class="fa fa-bars"></i></a></div></div>';
      
      var navbarTemp = '<ul class="nav navbar-nav quick-actions"><li class="dropdown divided user" id="current-user"><a class="dropdown-toggle options" data-toggle="dropdown" href="#">Jodo管理员 <i class="fa fa-caret-down"></i></a><ul class="dropdown-menu arrow settings"><li><a href="#"><i class="fa fa-user"></i> 设置</a></li><li class="divider"></li><li><a href="#"><i class="fa fa-power-off"></i> 登出</a></li></ul></li></ul>';

      var temp = '', li1ActiveCls, li2ActiveCls;
      that.sidebarConfig.forEach(function(item, index) {
        // 无折叠
        if(item.li1Url) {
          li1ActiveCls = parseInt(sbli1Index) === index ? ' class="active"' : '';

          temp += '<li' + li1ActiveCls + '><a href="' + item.li1Url + '"><i class="fa ' + item.li1Fa + '"></i> ' + item.li1 + '</a></li>';
        } 
        // 一级折叠
        else {
          li1ActiveCls = parseInt(sbli1Index) === index ? ' open active' : '';

          var item2Temp = '';
          item.li2List.forEach(function(item2, index2) {
            if(sbli2Index) li2ActiveCls = parseInt(sbli2Index) === index2 ? ' class="active"' : '';

            item2Temp += '<li' + li2ActiveCls + '><a href="' + item2.li2Url + '"><i class="fa fa-caret-right"></i> ' + item2.li2 + '</a></li>';
          });

          temp += '<li class="dropdown' + li1ActiveCls + '"><a href="#" class="dropdown-toggle" data-toggle="dropdown"><i class="fa ' + item.li1Fa + '"></i> ' + item.li1 + ' <b class="fa fa-plus dropdown-plus"></b></a><ul class="dropdown-menu animated fadeInLeft">' + item2Temp + '</ul></li>'
        }
      });
      var sidebarTemp = '<ul class="nav navbar-nav side-nav" id="sidebar"><li class="navigation" id="navigation"><ul class="menu">' + temp + '</ul></li></ul>';
      
      this.innerHTML = '<div class="navbar navbar-default navbar-fixed-top navbar-transparent-black mm-fixed-top" role="navigation" id="navbar">' + logoTemp + '<div class="navbar-collapse">' + navbarTemp + sidebarTemp + '</div></div>';

    };

    // 向文档插入实例回调
    proto.attachedCallback = function() {
      // console.log("attachedCallback");
    };

    // debugger
    document.registerElement('tag-topSidebar', {prototype: proto});
  },
  
}

TopSidebar.init();