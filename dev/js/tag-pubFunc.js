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
    var multiKeyArr = window.decodeURIComponent($.cookie('multiKeys')).split('&');
    var cookieStr = window.decodeURIComponent($.cookie(cookieKey));
    var cookiesObj = {};
    if(cookieStr) {
      var arr = cookieStr.split('&');
      var checkKey;
  
      for(var j=0; j<arr.length; j++) {
          var key = arr[j].split('=')[0];
          var value = arr[j].split('=')[1];
          var _arr = [];
          var isMulti = false;

          // 判断该key是否为多选
          for(var i=0; i<multiKeyArr.length; i++) {
            if(key === multiKeyArr[i]) {
              isMulti = true;
              break;
            }
          }

          // key不重复，value可能是数组或字符
          if(checkKey !== key) {
            checkKey = key;
            cookiesObj[key] = value;
            // 若该key是多选，对应的value为数组
            if(isMulti) cookiesObj[key] = [value];
          } 
          // key重复，value肯定为数组
          else {
            cookiesObj[key].push(value);
          }
      }
      // console.log(cookiesObj);
    }
    return cookiesObj;
  },


  /**
   * public function loading显隐
   * 
   */
  showLoading: function() {
    $('body').append('<div class="m_dialog" id="js_loading"><div class="mask"></div><div class="cssload-container"><div class="cssload-dot"></div><div class="step" id="cssload-s1"></div><div class="step" id="cssload-s2"></div><div class="step" id="cssload-s3"></div></div></div>');

    $('.m_dialog').height($(document).height());
  },
  hideLoading: function() {
    $('#js_loading').remove();
  }
  
}