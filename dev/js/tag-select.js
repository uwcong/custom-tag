/**
 * 多选下拉组件（配合提交使用）
 * @author Cc
 * @date 2016/12/14
 */
var Selector = {

  /**
   * private function 渲染选项数据
   * @param {object} dom
   * @param {object} obj
   * @param {string} obj.id
   * @param {string} obj.title
   * @param {string} obj.name
   * @param {array}  obj.data
   */
  _renderData: function(dom, obj) {
    // 生成列表模板
    var valueArr;
    if(obj['cookie'] && obj['name'] in obj['cookie']) {
      valueArr = obj['cookie'][obj['name']];
    }

    var temp = "";
    for(var i=0; i<obj['data'].length; i++) {
      var item = obj['data'][i];
      // 普通item
      var itemTemp = '<option value="' + item + '">' + item + '</option>';
      
      if(valueArr) {
        for(var j=0; j<valueArr.length; j++) {
          // 已选中item
          if(valueArr[j] === item) {
            itemTemp = '<option value="' + item + '" selected="selected">' + item + '</option>';
          }
        }
      }

      temp += itemTemp;
    }

    // 设置单选、多选属性
    var selectTypeAttr = "";
    if(obj['selectType'] === 'multi') {
      selectTypeAttr = "multiple";
    }

    dom.innerHTML = '<div class="form-group col-md-4"><label class="control-label col-md-3">' + obj['title'] + '</label><div class="col-md-9"><select class="form-control" id="' + obj['id'] + '" name="' + obj['name'] + '" ' + selectTypeAttr + '>' + temp + '</select></div>';

    $('#'+obj['id']).select2({
      placeholder: 'please select',
      allowClear: true
    });

  },
  
  /**
   * public function 设置cookie
   */
  setCookie: function(cookieKey, cookieStr, day) {
    $.cookie(cookieKey, cookieStr, { expires: day })
  },

  /**
   * public function 获取cookie
   */
  getCookie: function(cookieKey) {
    var cookieStr = window.decodeURIComponent($.cookie(cookieKey));
    var cookiesObj = {};
    if(cookieStr) {
      var arr = cookieStr.split('&');
      // console.log(arr);
      var checkKey;
  
      for(var j=0; j<arr.length; j++) {
          var key = arr[j].split('=')[0];
          var value = arr[j].split('=')[1];
          var _arr = [];

          if(checkKey !== key) {
            checkKey = key;
            _arr.push(value);
            cookiesObj[checkKey] = _arr;
          } else {
            if(cookiesObj[key] instanceof Array) {
              _arr = cookiesObj[key];
            }
            _arr.push(value);
            cookiesObj[key] = _arr;
          }
      }
      // console.log(cookiesObj);
    }
    return cookiesObj;
  },

  /**
   * public function 初始化组件
   * @author Cc
   */
  init: function() {
    var that = this;

    var proto = Object.create(HTMLElement.prototype);
    // 创建元素实例回调
    proto.createdCallback = function() {
      console.log("createdCallback");

      var selectType = this.getAttribute('data-selectType')
      var id = this.getAttribute('data-id');
      var title = this.getAttribute('data-title');
      var name = this.getAttribute('data-name');
      var url = this.getAttribute('data-url');
      var cookieKey = this.getAttribute('data-cookie');
      var selectorDefaultData = ['Data Loading...'];
      that._renderData(this, {
        'selectType': selectType,
        'id': id,
        'title': title,
        'name': name,
        'data': selectorDefaultData,
        'cookie': that.getCookie(cookieKey)
      });

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
            'selectType': selectType,
            'id': id,
            'title': title,
            'name': name,
            'data': res.data,
            'cookie': that.getCookie(cookieKey)
          });
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
    document.registerElement('tag-select', {prototype: proto});
  },
}

Selector.init();

/**
 * 绑定提交按钮点击事件
 */
$('#submit').bind('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  var $form = $(this).parents('form');
  var cookieKey = $form.attr('data-cookie');
  var cookieStr = $form.serialize();
  cookieStr ? Selector.setCookie(cookieKey, cookieStr, 7) : alert('请至少选择一项');
  alert("已点击查询" + cookieStr);
});