/**
 * 提交按钮
 * @author Cc
 * @date 2016/12/14
 */
var Confirm = {

  /**
   * public function 初始化组件
   * @author Cc
   */
  init: function() {
    var that = this;

    var proto = Object.create(HTMLElement.prototype);
    // 创建元素实例回调
    proto.createdCallback = function() {
      // console.log("createdCallback");
      var id = this.getAttribute('data-id');
      var cookieKey = this.getAttribute('data-cookie');
      // debugger
      this.innerHTML = '<button type="submit" class="btn btn-primary col-md-offset-1" id="' + id + '">查询</button>';

      $('#'+id).bind('click', function(e) {
        e.stopPropagation();
        e.preventDefault();

        // 设置多选的name到cookies中，方便后续getCookie()时组装请求数据
        var multiKeyArr = [], multiKeyStr = "";
        for(var i=0; i<$('select[multiple]').length; i++) {
          multiKeyArr.push($('select[multiple]')[i].getAttribute('name'));
        }
        multiKeyStr = multiKeyArr.join('&');
        window.PubFunc.setCookie('multiKeys', multiKeyStr, 7);

        var $form = $(this).parents('form');
        var cookieStr = $form.serialize();
        cookieStr ? window.PubFunc.setCookie(cookieKey, cookieStr, 7) : alert('请至少选择一项');
        console.log(window.PubFunc.getCookie(cookieKey));

        window.Table.requestData();
        alert("已点击查询" + cookieStr);
      });
      
    };

    // 向文档插入实例回调
    proto.attachedCallback = function() {
      // console.log("attachedCallback");
    };

    // debugger
    document.registerElement('tag-confirm', {prototype: proto});
  },
  
}

Confirm.init();