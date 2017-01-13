/**
 * 时间选择器
 * @author Cc
 * @date 2016/12/14
 */
var DatePicker = {

  /**
   * public function 初始化组件
   * @author Cc
   */
  init: function() {
    var proto = Object.create(HTMLElement.prototype);
    // 创建元素实例回调
    proto.createdCallback = function() {
      // console.log("createdCallback");
      var id = this.getAttribute('data-id'),
          name = this.getAttribute('data-name'),
          cookieKey = this.getAttribute('data-cookie');
      
      this.innerHTML = '<label for="btime" class="control-label col-md-3">日期</label><div class="col-md-9"><input type="text" id="' + id + '" class="form-control" name="' + name + '"><i class="glyphicon glyphicon-calendar fa fa-calendar" style="position: absolute;bottom: 10px;right: 24px;top: auto;cursor: pointer;"></i></div>';

      var options = {};
      options.ranges = {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      };
      options.alwaysShowCalendars = true;
      options.locale = {
          format: 'YYYY-MM-DD',
          "separator": ","
      }
      var $input = $('input[name="' + name + '"]');
      $input.daterangepicker(options, function(start, end, label) {});

      var name = $input.attr('name');
      var value = window.PubFunc.getCookie(cookieKey)[name];
      if(value) $input.val(value);
      
    };

    // 向文档插入实例回调
    proto.attachedCallback = function() {
      // console.log("attachedCallback");
    };

    // debugger
    document.registerElement('tag-datePicker', {prototype: proto});
  },
  
}

DatePicker.init();