requirejs.config({
    "paths": {
      "jquery": "jquery-3.1.1.min",
      "moment": "moment",
      "daterangepicker": "daterangepicker"
    }
});

requirejs(['jquery', 'moment', 'daterangepicker'] , function ($, moment) {
$(document).ready(function() {
  $('.demo i').click(function() {
    $(this).parent().find('input').click();
  });
  updateConfig();

  function updateConfig() {
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
    $('#config-demo').daterangepicker(options, function(start, end, label) {});

  }

});
});
