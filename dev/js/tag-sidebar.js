/**
 * 侧边栏
 * @author Cc
 * @date 2016/12/14
 */
var Sidebar = {
  // 数据配置
  config: [
    {
      li1: 'Dashboard',
      li1Fa: 'fa-dashboard',
      li1Url: '#0',
    },
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
      var li1Index = this.getAttribute('data-li1Index');
      var li2Index = this.getAttribute('data-li2Index');

      // debugger
      // var temp1 = '<li class="level1"><a href="index.html" class="active"><i class="fa fa-dashboard fa-fw"></i> Dashboard</a></li>';
      // var temp2 = '<li class="level1"><a href="#"><i class="fa fa-table fa-fw"></i> 市场概况<span class="fa arrow"></span></a><ul class="nav nav-second-level collapse"><li class="level2"><a href="#2">市场日概况</a></li></ul></li>';
      // var temp3 = ''
      // <li class="leve1 active">
      // 	<a href="#"><i class="fa fa-table fa-fw"></i> 运营概况<span class="fa arrow"></span></a>
      // 	<ul class="nav nav-second-level collapse in">
      // 		<li>
      // 			<a href="blank.html" class="active">运营所有游戏概况</a>
      // 		</li>
      // 		<li>
      // 			<a href="login.html">运营单个游戏概况</a>
      // 		</li>
      // 		<li>
      // 			<a href="login.html">运营游戏区概况</a>
      // 		</li>
      // 		<li>
      // 			<a href="login.html">运营游戏包卸载概况</a>
      // 		</li>
      // 		<li>
      // 			<a href="login.html">储值概况</a>
      // 		</li>
      // 		<li>
      // 			<a href="login.html">订单实时概况</a>
      // 		</li>
      // 		<li>
      // 			<a href="login.html">坏账订单概况</a>
      // 		</li>
      // 	</ul>
        
      // </li>

      var temp = '', li1ActiveCls, li2ActiveCls;
      that.config.forEach(function(item, index) {
        li1ActiveCls = parseInt(li1Index) === index ? ' class="active"' : '';

        // 无折叠
        if(item.li1Url) {
          temp += '<li><a href="' + item.li1Url + '"' + li1ActiveCls + '><i class="fa ' + item.li1Fa + ' fa-fw"></i> ' + item.li1 + '</a></li>';
        } 
        // 一级折叠
        else {
          var item2Temp = '';
          item.li2List.forEach(function(item2, index2) {
            if(li2Index) li2ActiveCls = parseInt(li2Index) === index2 ? ' class="active"' : '';
            
            item2Temp += '<li class="li2"><a href="' + item2.li2Url + '"' + li2ActiveCls + '>' + item2.li2 + '</a></li>';
          });

          temp += '<li' + li1ActiveCls + '><a href="#"><i class="fa ' + item.li1Fa + ' fa-fw"></i> ' + item.li1 + '<span class="fa arrow"></span></a><ul class="nav nav-second-level collapse">' + item2Temp + '</ul></li>'
        }
      });

      this.innerHTML = '<div class="navbar-default sidebar" role="navigation"><div class="sidebar-nav navbar-collapse"><ul class="nav in" id="side-menu">' + temp + '</ul></div></div>';

      // $('.li1')[li1Index]

    };

    // 向文档插入实例回调
    proto.attachedCallback = function() {
      // console.log("attachedCallback");
    };

    // debugger
    document.registerElement('tag-sidebar', {prototype: proto});
  },
  
}

Sidebar.init();