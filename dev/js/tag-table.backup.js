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

    if(obj['data'] instanceof Object && obj['data'].sort.length > 0) {
      sortKeyArr = obj['data'].sort;
      // 具体数据行数
      totalCount = obj['data'].page.recordCount;
      // 每页行数
      pageSize = obj['data'].page.pageSize;

      // 表头行
      var headData = obj['data'].head;
      console.log(headData);
      for(var i=0; i<headData.length; i++) {
        headTemp += '<th>' + headData[i] + '</th>';
      }

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
    } else {
      headTemp = '<td>' + obj['data'] + '</td>';
      totalTemp = '<td>-</td>';
      listTemp = '<tr><td>-</td></tr>'
    }

    dom.innerHTML = '<table id="' + obj['id'] + '" class="display" cellspacing="0" width="100%"><thead><tr>' + headTemp + '</tr></thead><tbody><tr>' + totalTemp + '</tr>' + listTemp + '</tbody></table>';

    $('#'+obj['id']).DataTable({
      "order": [[1, "desc"]],
      "pageLength": 10 + 1, // 算上“合计”一行，加1
      "lengthChange": false,
      "searching": false,
      renderer: "bootstrap",
      // "lengthMenu": [[1, 2, 3, -1], [1, 2, 3, "All"]],
      "language": {
        "info": "总数：" + totalCount,
        // "lengthMenu": "每页显示 _MENU_ records"
      }
    })

    $('#table_next').bind('click', function() {
      console.log('page change')
    });
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
      // that._renderData(this, {
      //   'id': id,
      //   'data': '无表头数据'
      // });

      var _this = this;
      $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        contentType: "application/json",
        success: function(res) {
          console.log('%csuccess', 'background: green; color: white;');
          // debugger
          that._renderData(_this, {
            'id': id,
            'data': res.data
          });
          console.log(res);
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