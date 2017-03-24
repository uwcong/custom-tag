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

                var $form = $(this).parents('form');
                $form.serialize() ? window.PubFunc.setCookie(oStaticData.reqCookie, $form.serialize(), 1) : alert('请至少选择一项');
                console.log('%cjson format:', 'background: green;color: #fff', window.PubFunc.getCookie(oStaticData.reqCookie));
                window.Table.requestData(true);
                // alert("已点击查询" + cookieStr);
            });
        });

        window.onload = function() {
            var oStaticData = JSON.parse($('tag-confirm').attr('data-static')),
                cookieJson = window.PubFunc.getCookie(oStaticData.reqCookie);
            if (cookieJson['isUpdate']) {
                delete cookieJson['isUpdate'];
                window.PubFunc.setCookie(oStaticData.reqCookie, cookieJson, 1)
                window.Table.requestData(true);
            }
        }
    },

}

Confirm.init();