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
                var multiKeyStr = "";
                for (var i = 0; i < $('select[multiple]').length; i++) {
                    var multiItem = $('select[multiple]')[i].getAttribute('name');
                    if (i === 0) {
                        multiKeyStr = "multiKeys=" + multiItem;
                    } else {
                        multiKeyStr += "|" + multiItem;
                    }
                }

                var $form = $(this).parents('form');
                // 要先判断有没有multiKeys，才能知道后续哪些key是multi类型的
                var cookieStr = multiKeyStr + (multiKeyStr === "" ? "" : "&") + $form.serialize();
                cookieStr ? window.PubFunc.setCookie(oStaticData.reqCookie, cookieStr, 7) : alert('请至少选择一项');
                console.log(window.PubFunc.getCookie(oStaticData.reqCookie));

                window.Table.requestData(true);
                // alert("已点击查询" + cookieStr);
            });
        });

    },

}

Confirm.init();