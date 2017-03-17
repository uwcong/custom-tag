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
        $('tag-datePicker').each(function() {
            var oStaticData = JSON.parse($(this).attr('data-static')),
                id = oStaticData.id,
                title = oStaticData.title,
                name = oStaticData.name,
                cookieKey = oStaticData.cookie;

            if (!id) id = "time";
            if (!title) title = "日期";
            if (!name) name = "time";

            $(this).html('<label for="btime">' + title + '</label><div><input type="text" id="' + id + '" class="form-control" name="' + name + '"><i class="glyphicon glyphicon-calendar fa fa-calendar" style="position: absolute;bottom: 10px;right: 24px;top: auto;cursor: pointer;"></i></div>');

            var options = {};
            options.showDropdowns = true;
            options.alwaysShowCalendars = true;
            options.format = 'YYYY-MM-DD';
            options.separator = ', ';

            var $input = $('input[name="' + name + '"]');
            $input.daterangepicker(options);

            var name = $input.attr('name');
            var value = window.PubFunc.getCookie(cookieKey)[name];
            if (value) $input.val(value);
        });
    },

}

DatePicker.init();