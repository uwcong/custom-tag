/**
 * 表格组件
 * @author Cc
 * @date 2016/12/15
 */
var Table = {
  // 局部变量
  localVal: {
    tableSelf: "",
    staticDataObj: {},
    reqDataObj: {},
    columns: [],
    tableHead: []
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
      that.localVal.tableSelf = this;
      that.localVal.staticDataObj = JSON.parse(this.getAttribute('data-staticData'));
      that.localVal.reqDataObj = JSON.parse(this.getAttribute('data-reqData'));
      
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
   * 
   */
  requestData: function(isTriggered) {
    var that = this;
    var _this = this.localVal.tableSelf,
        _staticDataObj = this.localVal.staticDataObj,
        _reqDataObj = this.localVal.reqDataObj;
    // 读取cookies中form表单的参数
    var reqData = window.PubFunc.getCookie(_staticDataObj.reqCookie);
    if(reqData.hasOwnProperty("undefined")) return false;
    
    // 组装request data，主要是翻页相关的和额外的参数
    for(var _reqDataObjItem in _reqDataObj) {
      reqData[_reqDataObjItem] = _reqDataObj[_reqDataObjItem];
    }

    // 返回数据前
    this._renderTable();

    // 再次触发更新表格
    if(isTriggered === true) {
      this._mainTable(reqData);
      return false;
    }

    // 返回数据后
    $.ajax({
      type: _staticDataObj.ajaxType,
      url: _staticDataObj.url,
      data: JSON.stringify(reqData),
      dataType: "json",
      contentType: "application/json",
      success: function(res) {
        console.log('%csuccess', 'background: green; color: white;');
        // 为了延迟看loading
        setTimeout(function() {
          that._renderTable(reqData, res.data);
        }, 1000)
          
      },
      error: function() {
        console.log('%cerror', 'background: red; color: white;');
      }
    });
  },


  /**
   * private function 渲染表格
   * 注：因为表头columns是动态渲染的，所以初始化表格时存在两次数据请求：一次返回表头，一次返回主体
   * 
   */
  _renderTable: function(__reqDataObj, renderTableObj) {
    var __this = this.localVal.tableSelf,
        __staticDataObj = this.localVal.staticDataObj;
    
    // 返回数据前
    $(__this).html('<div class="m_dataTable"><div class="cssload-loader"><div class="cssload-top"></div><div class="cssload-bottom"></div><div class="cssload-line"></div></div></div>');
    
    // 返回数据后
    if(renderTableObj && renderTableObj.head.length > 0) {
      // 设置列表表头字段顺序
      var sort = renderTableObj.sort;
      for(var i=0; i<sort.length; i++) {
        this.localVal.columns.push({
          "data": sort[i]
        })
      }

      // 存储表头
      this.localVal.tableHead = renderTableObj.head;

      this._mainTable(__reqDataObj);
    }

  },

  /**
   * private function 渲染表格主体，操作表格
   * 
   */
  _mainTable: function(___reqDataObj) {
    var that = this,
        ___this = this.localVal.tableSelf
        ___staticDataObj = this.localVal.staticDataObj,
        columns = this.localVal.columns;

    // 添加表头
    var tableToolbar = '<div class="btn-toolbar"><div class="btn-group pull-right focus-btn-group"><button class="btn btn-success">导出Excel</button><button class="btn btn-success showAllColumns">显示所有列</button></div></div>';
    var headTemp = "",
        headData = this.localVal.tableHead;
    for(var i=0; i<headData.length; i++) {
      headTemp += '<th>' + headData[i] + '<span class="hideColumn" title="隐藏" data-column=' + i + '></span></th>';
    }
    $(___this).html('<div class="m_dataTable">' + tableToolbar + '<table id="' + ___staticDataObj.id + '" class="display dt-bootstrap" cellspacing="0" width="100%"><thead><tr>' + headTemp + '</tr></thead><tbody></tbody></table></div>');

    // 渲染主体
    var dataTableContent = $('#'+___staticDataObj.id).DataTable({
      "pageLength": parseInt(this.localVal.reqDataObj.pageSize),
      "lengthChange": false,
      "searching": false,
      "language": that._dataTableConfig.lang,
      // "order": [[1, "desc"]],
      "ordering": false, // 因为开启了serverSide，所以排序也会发起ajax请求，但又因为只对当前页进行排序，因此要禁用这个排序
      "processing": true,
      "serverSide": true,  //启用服务器端分页
      "ajax": function(data, callback, settings) {
        // console.log(data);
        var param = ___reqDataObj;
        console.log("%cmaintable", "background: red", data);
        param.currentPage = (data.start / data.length) + 1;

        $.ajax({
          type: ___staticDataObj.ajaxType,
          url: ___staticDataObj.url,
          cache: false,  //禁用缓存
          data: JSON.stringify(param),  //传入组装的参数
          dataType: "json",
          contentType: "application/json",
          success: function (result) {
              console.log("%cmaintableReqSucc", "background: green", result);
              //封装返回数据
              var returnData = {};
              returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
              returnData.recordsTotal = result.data.page.recordCount; //返回数据全部记录
              returnData.recordsFiltered = result.data.page.recordCount; //后台不实现过滤功能，每次查询均视作全部结果
              
              var resList = result.data.page.resList;
              resList.push(result.data.total); // 加上“总计”行，用于显示，但不计入pageLength，见上
              returnData.data = resList; //返回的数据列表
              // console.log(returnData);
              //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
              //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
              callback(returnData);

              // 动态插入数据排序
              $('#'+___staticDataObj.id).trigger("update").tablesorter();
              // 初始化排序
              setTimeout(function() {
                // console.log(___staticDataObj);
                var sorting = [[___staticDataObj.orderColumn,___staticDataObj.orderDir]];
                //     cookies = window.PubFunc.getCookie(obj['cookieKey']);
                //     // debugger
                // if(!cookies.hasOwnProperty("undefined")) {
                //   sorting = [[parseInt(cookies.orderColumn[0]),parseInt(cookies.orderDir[0])]]
                // }
                $('#'+___staticDataObj.id).trigger("sorton",[sorting]);
              }, 1)   
          }
        })
      },
      // 设置列表表头字段顺序
      "columns": columns
    });

    // 设置table的横向滚动态
    // display: block时才能出现滚动条
    // display: table时才能在内容少的时候自适应宽度撑满table
    var _setTableLayout = function() {
      if($('table.dataTable tbody').width() > $('.dataTables_wrapper').width()) {
        $('table.dataTable').css({
          'display': 'block',
          'overflow-x': 'auto' 
        })
      } else {
        $('table.dataTable').css({
          'display': 'table'
        })
      }
    }
    _setTableLayout();

    // 显示隐藏列
    $('.hideColumn').bind('click', function(e) {
      e.stopPropagation();
      dataTableContent.column($(this).attr('data-column')).visible(false);
      _setTableLayout();

    });
    $('.showAllColumns').bind('click', function() {
      dataTableContent.columns().visible(true);
      _setTableLayout();
    })
  },


  /**
   * private object datatable配置
   * 
   */
  _dataTableConfig: {
    lang: {
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
      },
    },
  },

}

Table.init();