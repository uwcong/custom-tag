/**
 * 开关按钮
 * @author Young
 * @date 2017/01/06
 */
var Selector = {
  init: function() {
    var that = this;

    var proto = Object.create(HTMLElement.prototype);
    // 创建元素实例回调
    proto.createdCallback = function() {
      var id = this.getAttribute('data-id');
      var title = this.getAttribute('data-title');
      var name = this.getAttribute('data-name');
      var cookieKey = this.getAttribute('data-cookie');

      that._renderData(this, {
        'id': id,
        'title': title,
        'name': name,
        'cookie': window.PubFunc.getCookie(cookieKey)
      });
    };

    // 向文档插入实例回调
    proto.attachedCallback = function() {
      // console.log("attachedCallback");
    };

    // debugger
    document.registerElement('tag-switch', {prototype: proto});
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
    dom.innerHTML = '<label class="control-label col-md-4">' + obj['title'] + '</label><input id="' + obj['id'] + '" type="checkbox" name="' + obj['name'] + '" checked />';
    var mystate = true;
    if(obj['cookie'] && obj['name'] in obj['cookie']) {
        var valueArr = obj['cookie'][obj['name']];
        if(valueArr === 1){
        	mystate = true;
        }else if(valueArr === 0){
        	mystate = false;
        }
    }
    $('#'+obj['id']).bootstrapSwitch({
    	size:'mini',
		onInit:function(){
			if($(this).val() == 'on'){
				$(this).val("1"); 
			}else{
				$(this).val("0"); 
			}
		},
		onSwitchChange:function(event,state){  
            if(state==true){  
                $(this).val("1");  
            }else{  
                $(this).val("0");  
            }  
        },
        state:mystate,
	});
    
  },
  
}

Selector.init();