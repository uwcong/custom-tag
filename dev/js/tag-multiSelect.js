var Selector = {
  /**
   * 渲染选项数据
   * @author Cc
   * @date 2016/12/14
   * @param {object} dom
   * @param {object} obj
   * @param {string} obj.id
   * @param {string} obj.title
   * @param {string} obj.name
   * @param {array}  obj.data
   */
  renderData: function(dom, obj) {
    var temp = "";
    for(var i=0, len=obj['data'].length; i<len; i++) {
      var item = obj['data'][i];
      temp += '<option value="' + item + '">' + item + '</option>'
    }
    // debugger
    dom.innerHTML = '<div class="form-group col-md-4"><label class="control-label col-md-3">' + obj['title'] + '</label><div class="col-md-9"><select class="form-control" id="' + obj['id'] + '" name="' + obj['name'] + '" multiple>' + temp + '</select></div>';

    $('#'+obj['id']).select2({
      placeholder: 'please select',
      allowClear: true
    }).on('select2-open', function(){
      $(this).data('select2').results.addClass('overflow-hidden').perfectScrollbar();
    });
  },

  /**
   * 初始化组件
   * @author Cc
   * @date 2016/12/14
   */
  init: function() {
    var that = this;

    var proto = Object.create(HTMLElement.prototype);
    // 创建元素实例回调
    proto.createdCallback = function() {
      console.log("createdCallback");
      
      var id = this.getAttribute('data-id');
      var title = this.getAttribute('data-title');
      var name = this.getAttribute('data-name');
      var url = this.getAttribute('data-url');
      var selectorDefaultData = ['Data Loading...'];
      that.renderData(this, {
        'id': id,
        'title': title,
        'name': name,
        'data': selectorDefaultData
      });

      var _this = this;
      $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        contentType: "application/json",
        success: function(res) {
          console.log('%csuccess', 'background: green');
          // debugger
          that.renderData(_this, {
            'id': id,
            'title': title,
            'name': name,
            'data': res.data
          });
        },
        error: function() {
          console.log('%cerror', 'background: red');
        }
      });
    };

    // 向文档插入实例回调
    proto.attachedCallback = function() {
      console.log("attachedCallback");
    };

    // debugger
    document.registerElement('tag-multiSelect', {prototype: proto});
  },
}

Selector.init();