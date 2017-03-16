/**
 * 开关按钮
 * @author Young
 * @date 2017/01/06
 */
var Selector = {
    init: function() {
        var that = this;
        $('tag-switch').each(function() {
            var oStaticData = JSON.parse($(this).attr('data-static')),
                id = oStaticData.id,
                title = oStaticData.title,
                name = oStaticData.name,
                cookieKey = oStaticData.cookie;

            that._renderData(this, {
                'id': id,
                'title': title,
                'name': name,
                'cookie': window.PubFunc.getCookie(cookieKey)
            });
        });
    },


    /**
     * private function 渲染选项数据
     * @param {object} dom
     * @param {object} obj
     * @param {string} obj.id
     * @param {string} obj.title
     * @param {string} obj.name
     */
    _renderData: function(dom, obj) {
        // 设置单选、多选属性
        var selectTypeAttr = "";
        dom.innerHTML = '<label>' + obj['title'] + '</label><div><input id="' + obj['id'] + '" type="checkbox" name="' + obj['name'] + '" checked /></div>';
        var mystate = true;
        if (obj['cookie'] && obj['name'] in obj['cookie']) {
            var valueArr = obj['cookie'][obj['name']];
            if (valueArr === 1) {
                mystate = true;
            } else if (valueArr === 0) {
                mystate = false;
            }
        }
        $('#' + obj['id']).bootstrapSwitch({
            size: 'normal',
            onInit: function() {
                if ($(this).val() == 'on') {
                    $(this).val("1");
                } else {
                    $(this).val("0");
                }
            },
            onSwitchChange: function(event, state) {
                if (state == true) {
                    $(this).val("1");
                } else {
                    $(this).val("0");
                }
            },
            state: mystate,
        });

    },

}

Selector.init();