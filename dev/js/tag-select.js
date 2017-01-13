/**
 * 下拉选框
 * @author Cc
 * @date 2016/12/14
 */
var Selector = {

  /**
   * public function 初始化组件
   * 
   */
  init: function() {
    var that = this;

    var proto = Object.create(HTMLElement.prototype);
    // 创建元素实例回调
    proto.createdCallback = function() {
      // console.log("createdCallback");
      var selectType = this.getAttribute('data-selectType')
      var id = this.getAttribute('data-id');
      var title = this.getAttribute('data-title');
      var name = this.getAttribute('data-name');
      var cookieKey = this.getAttribute('data-cookie');
      var defaultTips = this.getAttribute('data-defaultTips');
      if(defaultTips == undefined){
    	  defaultTips = ''
      }
      that._renderData(this, {
        'selectType': selectType,
        'id': id,
        'title': title,
        'name': name,
        'data': $(this).html(),
        'tips': defaultTips,
        'cookie': window.PubFunc.getCookie(cookieKey)
      });
    };

    // 向文档插入实例回调
    proto.attachedCallback = function() {
      // console.log("attachedCallback");
    };

    // debugger
    document.registerElement('tag-select', {prototype: proto});
  },


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

    dom.innerHTML = '<label>' + obj['title'] + '</label><div><select class="form-control" id="' + obj['id'] + '" name="' + obj['name'] + '" ' + selectTypeAttr + '>' + temp + '</select>';
    $('#'+obj['id']).select2({
      placeholder: obj['tips'],
      allowClear: true
    });

    // 从cookies中读取上一次操作中已选中的值
    if(obj['cookie'] && obj['name'] in obj['cookie']) {
      var valueArr = obj['cookie'][obj['name']];
      $('#'+obj['id']).val(valueArr).trigger('change');
    }
  },
  
}

Selector.init();