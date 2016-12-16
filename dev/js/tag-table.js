/**
 * table组件
 * @author Cc
 * @date 2016/12/15
 */
var Table = {

  /**
   * private function 渲染选项数据
   * @param {object} dom
   * @param {object} obj
   */
  _renderData: function(dom, obj) {
    var headTemp = "",
        totalTemp = "",
        listTemp = "",
        totalCount = 0,
        pageSize = "1",
        sortKeyArr = [];
    
    // 初次加载，返回数据后
    if(obj['data'] instanceof Object && obj['data'].sort.length > 0) {
      // 添加表头
      var headData = obj['data'].head;
      console.log(headData);
      for(var i=0; i<headData.length; i++) {
        headTemp += '<th>' + headData[i] + '</th>';
      }
      dom.innerHTML = '<table id="' + obj['id'] + '" class="display" cellspacing="0" width="100%"><thead><tr>' + headTemp + '</tr></thead><tbody></tbody></table>';



      sortKeyArr = obj['data'].sort;
      // 具体数据行数
      totalCount = obj['data'].page.recordCount;
      // 每页行数
      pageSize = obj['data'].page.pageSize;
      console.log(totalCount);

      

      // 总计行
      var totalData = obj['data'].total;
      for(var i=0; i<sortKeyArr.length; i++) {
        totalTemp += '<td>' + totalData[sortKeyArr[i]] + '</td>';
      }

      // 具体数据行
      var listData = obj['data'].page.resList;
      if(listData instanceof Array && listData.length > 0) {
        for(var i=0; i<listData.length; i++) {
          var itemTemp = "";
          for(var j=0; j<sortKeyArr.length; j++) {
            itemTemp += '<td>' + listData[i][sortKeyArr[j]] + '</td>';
          }
          listTemp += '<tr>' + itemTemp + '</tr>';
        }
      }

      $('#'+obj['id']).DataTable({
        "order": [[1, "desc"]],
        "pageLength": pageSize + 1, // 算上“合计”一行，加1
        "lengthChange": false,
        "searching": false,
        // "language": {
        //   "info": "总数：" + totalCount,
        //   "lengthMenu": "每页显示 _MENU_ records"
        // }
        serverSide: true,  //启用服务器端分页
        ajax: function(data, callback, settings) {
          var param = {};
          // param.limit = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
          // param.start = data.start;//开始的记录序号
          // param.page = (data.start / data.length)+1;//当前页码
          param.draw = data.draw;
          param.start = data.start;
          // param.length
          debugger

        } 
      })



    }

    // 初次加载，返回数据前
    else {
      dom.innerHTML = '<div class="w_tableEmptyLoading">Table is loading...</div>';
    }
  },

  /**
   * public function 初始化组件
   */
  init: function() {
    var that = this;

    var proto = Object.create(HTMLElement.prototype);
    // 创建元素实例回调
    proto.createdCallback = function() {
      console.log("createdCallback");
      var id = this.getAttribute('data-id');
      var url = this.getAttribute('data-url');

      // 初次加载，返回数据前
      that._renderData(this, {
        'id': id
      });

      // 初次加载，返回数据后
      var _this = this;
      $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        contentType: "application/json",
        success: function(res) {
          console.log('%csuccess', 'background: green; color: white;');
          // 为了延迟看loading
          setTimeout(function() {
            that._renderData(_this, {
              'id': id,
              'data': res.data
            });
          }, 500)
            
        },
        error: function() {
          console.log('%cerror', 'background: red; color: white;');
        }
      });

    };

    // 向文档插入实例回调
    proto.attachedCallback = function() {
      console.log("attachedCallback");
    };

    // debugger
    document.registerElement('tag-table', {prototype: proto});
  },
}

Table.init();