/*! jodo-widget 2016-12-23 */
var DatePicker={init:function(){var a=Object.create(HTMLElement.prototype);a.createdCallback=function(){var a=this.getAttribute("data-cookie");this.innerHTML='<label for="btime" class="control-label col-md-3">日期</label><div class="col-md-9"><input type="text" id="config-demo" class="form-control" name="time"><i class="glyphicon glyphicon-calendar fa fa-calendar" style="position: absolute;bottom: 10px;right: 24px;top: auto;cursor: pointer;"></i></div>';var b={};b.ranges={Today:[moment(),moment()],Yesterday:[moment().subtract(1,"days"),moment().subtract(1,"days")],"Last 7 Days":[moment().subtract(6,"days"),moment()],"Last 30 Days":[moment().subtract(29,"days"),moment()],"This Month":[moment().startOf("month"),moment().endOf("month")],"Last Month":[moment().subtract(1,"month").startOf("month"),moment().subtract(1,"month").endOf("month")]},b.alwaysShowCalendars=!0,b.locale={format:"YYYY-MM-DD",separator:","};var c=$('input[name="time"]');c.daterangepicker(b,function(a,b,c){});var d=c.attr("name"),e=window.PubFunc.getCookie(a)[d];e&&c.val(e)},a.attachedCallback=function(){},document.registerElement("tag-datePicker",{prototype:a})}};DatePicker.init();