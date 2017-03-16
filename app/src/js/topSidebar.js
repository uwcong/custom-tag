/**
 * 顶栏和边栏
 * @author Cc
 * @date 2016/12/14
 */
var TopSidebar = {
    // 边栏配置
    loginOutUrl: "#",
    mainUrl: "#",
    sidebarConfig: [{
            li1: 'Dashboard',
            li1Fa: 'fa-dashboard',
            li1Url: '#0',
        },
        {
            li1: '市场概况',
            li1Fa: 'fa-th-large',
            li2List: [{
                li2: '市场日概况',
                li2Url: 'market_day.do'
            }]
        },
        {
            li1: '运营概况',
            li1Fa: 'fa-th-large',
            li2List: [{
                    li2: '运营所有游戏概况',
                    li2Url: 'game_all.do'
                },
                {
                    li2: '运营单个游戏概况',
                    li2Url: 'game_single.do'
                },
                {
                    li2: '运营游戏区服概况',
                    li2Url: 'game_server.do'
                },
                {
                    li2: '储值概况',
                    li2Url: 'game_recharge.do'
                },
                {
                    li2: '订单实时概况',
                    li2Url: 'order_time.do'
                },
                {
                    li2: '坏账订单概况',
                    li2Url: 'order_failed.do'
                }
            ]
        }
    ],

    /**
     * public function 初始化组件
     * 
     */
    init: function() {
        var $tsb = $('#topSidebar'),
            sbli1Index = $tsb.attr('data-sbli1Index'),
            sbli2Index = $tsb.attr('data-sbli2Index'),
            logoTemp = '<div class="navbar-header">' +
            '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button>' +
            '<a class="navbar-brand" href="' + this.mainUrl + '">Jodo Data System</a>' +
            '</div>',
            navbarTemp = '<ul class="nav navbar-top-links navbar-right">' +
            '<li class="dropdown">' +
            '<a class="dropdown-toggle" data-toggle="dropdown" href="#"><i class="fa fa-user fa-fw"></i> <i class="fa fa-caret-down"></i></a>' +
            '<ul class="dropdown-menu dropdown-user">' +
            '<li><a href="#"><i class="fa fa-user fa-fw"></i> 设置</a></li>' +
            '<li><a href="#"><i class="fa fa-gear fa-fw"></i> 帮助</a></li>' +
            '<li class="divider"></li>' +
            '<li><a href="' + this.loginOutUrl + '"><i class="fa fa-sign-out fa-fw"></i> 登出</a></li>' +
            '</ul>' +
            '</li>' +
            '</ul>';

        var temp = '',
            li1ActiveCls,
            li2ActiveCls;

        this.sidebarConfig.forEach(function(item, index) {
            li1ActiveCls = parseInt(sbli1Index) === index ? ' class="active"' : '';

            // 无折叠
            if (item.li1Url) {
                temp += '<li><a href="' + item.li1Url + '"' + li1ActiveCls + '><i class="fa ' + item.li1Fa + ' fa-fw"></i> ' + item.li1 + '</a></li>';
            }
            // 一级折叠
            else {
                var item2Temp = '';
                item.li2List.forEach(function(item2, index2) {
                    if (sbli2Index) li2ActiveCls = parseInt(sbli2Index) === index2 ? ' class="active"' : '';

                    item2Temp += '<li class="li2"><a href="' + item2.li2Url + '"' + li2ActiveCls + '>' + item2.li2 + '</a></li>';
                });

                temp += '<li' + li1ActiveCls + '><a href="#"><i class="fa ' + item.li1Fa + ' fa-fw"></i> ' + item.li1 + '<span class="fa arrow"></span></a><ul class="nav nav-second-level collapse">' + item2Temp + '</ul></li>'
            }
        });
        var sidebarTemp = '<div class="navbar-default sidebar" role="navigation"><div class="sidebar-nav navbar-collapse" id="js_sidebar"><ul class="nav in" id="side-menu">' + temp + '</ul></div></div>';

        $tsb.html('<nav class="navbar navbar-default navbar-fixed-top" role="navigation">' + logoTemp + navbarTemp + sidebarTemp + '</nav>');
    },

}

TopSidebar.init();
// $('js_sideBar').niceScroll();