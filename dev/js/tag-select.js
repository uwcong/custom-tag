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
    // 设置单选、多选属性
    var selectTypeAttr = "";
    if(obj['selectType'] === 'multi') {
      selectTypeAttr = "multiple";
    }
    var temp = obj['data'];

    dom.innerHTML = '<div class="form-group col-md-4"><label class="control-label col-md-3">' + obj['title'] + '</label><div class="col-md-9"><select class="form-control" id="' + obj['id'] + '" name="' + obj['name'] + '" ' + selectTypeAttr + '>' + temp + '</select></div>';

    $('#'+obj['id']).select2({
      placeholder: 'please select',
      allowClear: true
    });

    // 从cookies中读取上一次操作中已选中的值
    if(obj['cookie'] && obj['name'] in obj['cookie']) {
      var valueArr = obj['cookie'][obj['name']];
      $('#'+obj['id']).val(valueArr).trigger('change');
    }
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
    var multiKeyArr = window.decodeURIComponent($.cookie('multiKeys')).split('&');
    var cookieStr = window.decodeURIComponent($.cookie(cookieKey));
    var cookiesObj = {};
    if(cookieStr) {
      var arr = cookieStr.split('&');
      var checkKey;
  
      for(var j=0; j<arr.length; j++) {
          var key = arr[j].split('=')[0];
          var value = arr[j].split('=')[1];
          var _arr = [];
          var isMulti = false;

          // 判断该key是否为多选
          for(var i=0; i<multiKeyArr.length; i++) {
            if(key === multiKeyArr[i]) {
              isMulti = true;
              break;
            }
          }

          // key不重复，value可能是数组或字符
          if(checkKey !== key) {
            checkKey = key;
            cookiesObj[key] = value;
            // 若该key是多选，对应的value为数组
            if(isMulti) cookiesObj[key] = [value];
          } 
          // key重复，value肯定为数组
          else {
            cookiesObj[key].push(value);
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
      var cookieKey = this.getAttribute('data-cookie');

      that._renderData(this, {
        'selectType': selectType,
        'id': id,
        'title': title,
        'name': name,
        'data': $(this).html(),
        'cookie': that.getCookie(cookieKey)
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

  // 设置多选的name到cookies中，方便后续getCookie()时组装请求数据
  var multiKeyArr = [], multiKeyStr = "";
  for(var i=0; i<$('select[multiple]').length; i++) {
    multiKeyArr.push($('select[multiple]')[i].getAttribute('name'));
  }
  multiKeyStr = multiKeyArr.join('&');
  Selector.setCookie('multiKeys', multiKeyStr, 7);

  var $form = $(this).parents('form');
  var cookieKey = $form.attr('data-cookie');
  var cookieStr = $form.serialize();
  cookieStr ? Selector.setCookie(cookieKey, cookieStr, 7) : alert('请至少选择一项');
  console.log(Selector.getCookie(cookieKey));
  
  window.Table.requestData();
  alert("已点击查询" + cookieStr);
});