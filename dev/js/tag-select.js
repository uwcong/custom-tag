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
      var isRequired = this.getAttribute('data-isRequired');
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
        'isRequired': isRequired,
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
    // 调用select2方法生成选框
    var $select = $('#'+obj['id']);
    $select.select2({
      placeholder: obj['tips'],
      allowClear: true
    });

    // 从cookies中读取上一次操作中已选中的值
    if(obj['cookie'] && obj['name'] in obj['cookie']) {
      var valueArr = obj['cookie'][obj['name']];
      $select.val(valueArr).trigger('change');
    }

    // 检测是否必需
    if(obj['isRequired']) {
      // 加载时，检测是否必需
      console.log($select.val());
      if((obj['selectType'] === 'multi' && $select.val().length === 0) || !$select.val()) $(dom).attr('data-errorTip', '请选择'+obj['title']);

      // 操作改变值时，检测是否必需
      $select.bind('change', function() {
        console.log($(this).val());
        if((obj['selectType'] === 'multi' && $(this).val().length === 0) || !$(this).val()) {
          $(dom).attr('data-errorTip', '请选择'+obj['title']);
        } else {
          $(dom).removeAttr('data-errorTip');
        }
      });
    }
    
    
  },
  
}

Selector.init();