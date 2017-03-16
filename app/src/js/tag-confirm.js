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
        $('tag-confirm').each(function() {
            var oStaticData = JSON.parse($(this).attr('data-static'));
            $(this).html('<button type="submit" class="btn btn-primary" id="' + oStaticData.id + '">查询</button>');

            $('#' + oStaticData.id).bind('click', function(e) {
                e.stopPropagation();
                e.preventDefault();

                // 检测是否有必需项
                var $errorTips = $('[data-errorTip]');
                if ($errorTips.length > 0) {
                    return alert($errorTips[0].getAttribute('data-errorTip'));
                }

                // 设置多选的name到cookies中，方便后续getCookie()时组装请求数据
                var multiKeyArr = [],
                    multiKeyStr = "";
                for (var i = 0; i < $('select[multiple]').length; i++) {
                    multiKeyArr.push($('select[multiple]')[i].getAttribute('name'));
                }
                multiKeyStr = multiKeyArr.join('&');
                window.PubFunc.setCookie('multiKeys', multiKeyStr, 7);

                var $form = $(this).parents('form');
                var cookieStr = $form.serialize();
                cookieStr ? window.PubFunc.setCookie(oStaticData.reqCookie, cookieStr, 7) : alert('请至少选择一项');
                console.log(window.PubFunc.getCookie(oStaticData.reqCookie));

                window.Table.requestData(true);
                // alert("已点击查询" + cookieStr);
            });
        });

    },

}

Confirm.init();