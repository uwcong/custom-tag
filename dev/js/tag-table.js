/**
 * 表格组件
 * @author Cc
 * @date 2016/12/15
 */
var Table = {
  // 局部变量
  config: {
    dom: "",
    id: "",
    ajaxType: "",
    url: "",
    pageSize: "",
    cookieKey: "",
    reqCookie: "",
    otherReqData: "",
    reqData: {},
  },

  /**
   * public function 初始化组件
   */
  init: function() {
    console.log('table init');
    var that = this;

    var proto = Object.create(HTMLElement.prototype);
    // 创建元素实例回调
    proto.createdCallback = function() {
      // console.log("createdCallback");

      that.config.dom = this;
      that.config.id = this.getAttribute('data-id');
      that.config.ajaxType = this.getAttribute('data-ajaxType');
      that.config.url = this.getAttribute('data-url');
      that.config.pageSize = this.getAttribute('data-pageSize');
      that.config.cookieKey = this.getAttribute('data-cookie');
      that.config.reqCookie = this.getAttribute('data-reqCookie');
      that.config.otherReqData = this.getAttribute('data-otherReqData');
      
      that.requestData();
    };

    // 向文档插入实例回调
    proto.attachedCallback = function() {
      // console.log("attachedCallback");
    };

    // debugger
    document.registerElement('tag-table', {prototype: proto});
  },


  /**
   * public function 请求数据
   */
  requestData: function() {
    var that = this;
    
    // 组装request data
    this.config.reqData = window.PubFunc.getCookie(this.config.reqCookie);
    this.config.reqData['pageSize'] = this.config.pageSize;
    this.config.reqData['currentPage'] = 1;
    var otherReqData = JSON.parse(this.config.otherReqData);
    for(var i in otherReqData) {
      this.config.reqData[i] = otherReqData[i];
    }
    if(this.config.reqData.hasOwnProperty("undefined"))  return false;

    // 返回数据前
    that._renderData(this, {
        'id': that.config.id
    });

    // 返回数据后
    $.ajax({
      type: that.config.ajaxType,
      url: that.config.url,
      data: JSON.stringify(that.config.reqData),
      dataType: "json",
      contentType: "application/json",
      success: function(res) {
        console.log('%csuccess', 'background: green; color: white;');
        // 为了延迟看loading
        setTimeout(function() {
          that._renderData(that.config.dom, {
            'id': that.config.id,
            'ajaxType': that.config.ajaxType,
            'pageSize': that.config.pageSize,
            'cookieKey': that.config.cookieKey,
            'data': res.data
          });
        }, 100)
          
      },
      error: function() {
        console.log('%cerror', 'background: red; color: white;');
      }
    });
  },


  /**
   * private function 渲染选项数据
   * @param {object} dom
   * @param {object} obj
   */
  _renderData: function(dom, obj) {
    var that = this;
    var headTemp = "";
    var tableToolbar = '<div class="btn-toolbar"><div class="btn-group pull-right focus-btn-group"><button class="btn btn-success">导出Excel</button><button class="btn btn-success showAllColumns">显示所有列</button></div></div>';
    
    // 初次加载，返回数据后
    if(obj['data'] instanceof Object && obj['data'].sort.length > 0) {
      // 添加表头
      var headData = obj['data'].head;
      console.log(headData);
      for(var i=0; i<headData.length; i++) {
        headTemp += '<th>' + headData[i] + '<span class="hideColumn" title="隐藏" data-column=' + i + '>×</span></th>';
      }
      dom.innerHTML = '<div class="m_dataTable">' + tableToolbar + '<table id="' + obj['id'] + '" class="display dt-bootstrap" cellspacing="0" width="100%"><thead><tr>' + headTemp + '</tr></thead><tbody></tbody></table></div>';
      
      // 只对当前页进行排序，引入tablesorter
      $('#'+obj['id']).tablesorter().bind('sortEnd', function(sorter) {
        var cookieKey = obj['cookieKey'];
        var sortList = sorter.target.config.sortList;
        var cookieStr = 'orderColumn=' + sortList[0][0] + '&orderDir=' + sortList[0][1];
        window.PubFunc.setCookie(cookieKey, cookieStr, 7)
        console.log(sorter.target.config.sortList);
      });

      // 设置列表表头字段顺序
      var columns = [], sort = obj['data'].sort;
      for(var i=0; i<sort.length; i++) {
        columns.push({
          "data": sort[i]
        })
      }

      // 设置组件文案
      var lang = {
          "sProcessing": "处理中...",
          "sLengthMenu": "每页 _MENU_ 项",
          "sZeroRecords": "没有匹配结果",
          "sInfo": "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项",
          "sInfoEmpty": "当前显示第 0 至 0 项，共 0 项",
          "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
          "sInfoPostFix": "",
          "sSearch": "搜索:",
          "sUrl": "",
          "sEmptyTable": "表中数据为空",
          "sLoadingRecords": "载入中...",
          "sInfoThousands": ",",
          "oPaginate": {
              "sFirst": "首页",
              "sPrevious": "上一页",
              "sNext": "下一页",
              "sLast": "末页",
              "sJump": "跳转"
          },
          "oAria": {
              "sSortAscending": ": 以升序排列此列",
              "sSortDescending": ": 以降序排列此列"
          }
      };

      // 渲染表格主体
      var dataTableContent = $('#'+obj['id']).DataTable({
        "pageLength": obj['data'].page.pageSize + 1, // 算上“合计”一行，加1
        "lengthChange": false,
        "searching": false,
        "language": lang,
        // "order": [[1, "desc"]],
        "ordering": false, // 因为开启了serverSide，所以排序也会发起ajax请求，但又因为只对当前页进行排序，因此要禁用这个排序
        "processing": true,
        "serverSide": true,  //启用服务器端分页
        "ajax": function(data, callback, settings) {
          // console.log(data);
          var param = that.config.reqData;
          param.currentPage = (data.start / data.length) + 1;

          $.ajax({
            type: obj['ajaxType'],
            url: dom.getAttribute('data-url'),
            cache: false,  //禁用缓存
            data: JSON.stringify(param),  //传入组装的参数
            dataType: "json",
            contentType: "application/json",
            success: function (result) {
                //封装返回数据
                var returnData = {};
                returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                returnData.recordsTotal = result.data.page.recordCount; //返回数据全部记录
                returnData.recordsFiltered = result.data.page.recordCount; //后台不实现过滤功能，每次查询均视作全部结果
                
                var resList = result.data.page.resList;
                resList.push(result.data.total); // 加上“总计”行
                
                returnData.data = resList; //返回的数据列表
                //console.log(returnData);
                //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                callback(returnData);

                // 动态插入数据排序
                $('#'+obj['id']).trigger("update");
                // 初始化排序
                setTimeout(function() {
                  var sorting = [[1,1]],
                      cookies = window.PubFunc.getCookie(obj['cookieKey']);
                      // debugger
                  if(!cookies.hasOwnProperty("undefined")) {
                    sorting = [[parseInt(cookies.orderColumn[0]),parseInt(cookies.orderDir[0])]]
                  }
                  $('#'+obj['id']).trigger("sorton",[sorting]);
                }, 1)   
            }
          })
        },
        // 设置列表表头字段顺序
        "columns": columns
      });

      // trigger
      $('.hideColumn').bind('click', function(e) {
        e.stopPropagation();
        dataTableContent.column($(this).attr('data-column')).visible(false);
      });
      $('.showAllColumns').bind('click', function() {
        dataTableContent.columns().visible(true);
      })
    }

    // 初次加载，返回数据前
    else {
      dom.innerHTML = '<div class="m_dataTable"><div class="w_tableEmptyLoading">表格加载中，请稍后...</div></div>';
    }
  },

}

Table.init();