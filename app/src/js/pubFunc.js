/**
 * 公共方法
 * @author Cc
 * @date 2016/12/14
 */
var PubFunc = {

    /**
     * public function 设置cookie
     * 
     */
    setCookie: function(cookieKey, cookieStr, day) {
        $.cookie(cookieKey, cookieStr, { expires: day })
    },


    /**
     * public function 获取cookie
     * 
     */
    getCookie: function(cookieKey) {
        var cookieStr = window.decodeURIComponent($.cookie(cookieKey));
        var cookiesObj = {};
        if (cookieStr) {
            var arr = cookieStr.split('&');
            var checkKey,
                multiKeyArr;

            for (var j = 0; j < arr.length; j++) {
                var key = arr[j].split('=')[0],
                    value = arr[j].split('=')[1];
                var isMulti = false;
                if (j === 0) multiKeyArr = value.split('|');

                // 判断该key是否为多选。若该key是多选，cookiesObj[key]一定要转成数组
                for (var i = 0; i < multiKeyArr.length; i++) {
                    if (key === multiKeyArr[i]) {
                        isMulti = true;
                        break;
                    }
                }

                // key不重复，cookiesObj[key]可能是数组或字符
                if (checkKey !== key) {
                    checkKey = key;
                    cookiesObj[key] = value;
                    // 若该key是多选，cookiesObj[key]一定要转成数组
                    if (isMulti) cookiesObj[key] = [value];
                }
                // key重复，cookiesObj[key]肯定为数组
                else {
                    cookiesObj[key].push(value);
                }
            }
        }
        return cookiesObj;
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