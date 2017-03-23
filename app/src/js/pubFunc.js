/**
 * 公共方法
 * @author Cc
 * @date 2016/12/14
 */
var PubFunc = {

    /**
     * public function form提交字符串转JSON对象
     * 
     */
    formSubmitStr2Json: function(_str) {
        /**
         * form提交的字符串拼接处理
         * 要先判断有没有multiKeys，才能知道后续哪些key是multi类型的，所以放置于前面
         */
        var multiKeyStr = "";
        for (var i = 0; i < $('select[multiple]').length; i++) {
            var multiItem = $('select[multiple]')[i].getAttribute('name');
            if (i === 0) {
                multiKeyStr = "multiKeys=" + multiItem;
            } else {
                multiKeyStr += "|" + multiItem;
            }
        }
        var formSubmitStr = multiKeyStr + (multiKeyStr === "" ? "" : "&") + _str;
        console.log('%cform format:', 'background: green;color: #fff', formSubmitStr);

        /**
         * 字符串转JSON对象
         */
        var arr = formSubmitStr.split('&'),
            jsonObj = {},
            checkKey,
            multiKeyArr = [];

        for (var j = 0; j < arr.length; j++) {
            var key = arr[j].split('=')[0],
                value = arr[j].split('=')[1];
            var isMulti = false;
            if (key === 'multiKeys') multiKeyArr = value.split('|');

            // 判断该key是否为多选。若该key是多选，jsonObj[key]一定要转成数组
            for (var i = 0; i < multiKeyArr.length; i++) {
                if (key === multiKeyArr[i]) {
                    isMulti = true;
                    break;
                }
            }
            // key不重复，jsonObj[key]可能是数组或字符
            if (checkKey !== key) {
                checkKey = key;
                jsonObj[key] = value;
                // 若该key是多选，jsonObj[key]一定要转成数组
                if (isMulti) jsonObj[key] = [value];
            }
            /**
             * key重复，但无multiKeys属性
             * 这是为了更新这一版之后，在不清除cookies的情况也能正常显示做的特殊处理，所以 多选的已选项 会与 cookies中的数据不一致，但关系不大。
             * 之后的操作就会重写cookies，重写后“key重复”与“multiKeys属性”必定是同时出现的，也就不会走这个步骤了。
             */
            else if (multiKeyArr.length === 0) {
                jsonObj[key] = [value];
            }
            // key重复，jsonObj[key]肯定为数组
            else {
                jsonObj[key].push(value);
            }
        }

        delete jsonObj['multiKeys'];
        return jsonObj;
    },


    /**
     * public function 设置cookie
     * 
     */
    setCookie: function(cookieKey, cookieVal, day) {
        var cookieJsonStr = "";
        switch (typeof cookieVal) {
            case 'string':
                cookieJsonStr = JSON.stringify(this.formSubmitStr2Json(cookieVal));
                break;
            case 'object':
                cookieJsonStr = JSON.stringify(cookieVal);
                break;
            default:
                break;
        }
        $.cookie(cookieKey, cookieJsonStr, { expires: day });
        console.log('%cjson string format:', 'background: green;color: #fff', cookieJsonStr);
    },


    /**
     * public function 获取cookie
     * 
     */
    getCookie: function(cookieKey) {
        return !$.cookie(cookieKey) ? {} : JSON.parse($.cookie(cookieKey));
    },


    /**
     * public function 更新cookie
     * 
     */
    updateCookie: function(cookieKey, key, value) {
        var cookieJson = this.getCookie(cookieKey),
            updatedCookieJson = $.isEmptyObject(cookieJson) ? {} : cookieJson; // 这里浅拷贝即可，因为每调用该方法一次都是新对象
        if (value) {
            updatedCookieJson[key] = value;
        } else if (key in updatedCookieJson) {
            delete updatedCookieJson[key];
        }
        this.setCookie(cookieKey, updatedCookieJson, 1);
    },


    /**
     * public function loading显隐
     * 
     */
    showLoading: function() {
        $('body').append('<div class="m_dialog" id="js_loading"><div class="mask"></div><div class="w_pageLoading">Loading</div></div>');
    },
    hideLoading: function() {
        $('#js_loading').remove();
    }

}