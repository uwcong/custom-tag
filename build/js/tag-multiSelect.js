/*! jodo-widget 2016-12-16 */
var Selector={_renderData:function(a,b){var c;b.cookie&&b.name in b.cookie&&(c=b.cookie[b.name]);for(var d="",e=0;e<b.data.length;e++){var f=b.data[e],g='<option value="'+f+'">'+f+"</option>";if(c)for(var h=0;h<c.length;h++)c[h]===f&&(g='<option value="'+f+'" selected="selected">'+f+"</option>");d+=g}a.innerHTML='<div class="form-group col-md-4"><label class="control-label col-md-3">'+b.title+'</label><div class="col-md-9"><select class="form-control" id="'+b.id+'" name="'+b.name+'" multiple>'+d+"</select></div>",$("#"+b.id).select2({placeholder:"please select",allowClear:!0}).on("select2:open",function(){})},setCookie:function(a,b,c){$.cookie(a,b,{expires:c})},getCookie:function(a){var b=window.decodeURIComponent($.cookie(a)),c={};if(b)for(var d,e=b.split("&"),f=0;f<e.length;f++){var g=e[f].split("=")[0],h=e[f].split("=")[1],i=[];d!==g?(d=g,i.push(h),c[d]=i):(c[g]instanceof Array&&(i=c[g]),i.push(h),c[g]=i)}return c},init:function(){var a=this,b=Object.create(HTMLElement.prototype);b.createdCallback=function(){console.log("createdCallback");var b=this.getAttribute("data-id"),c=this.getAttribute("data-title"),d=this.getAttribute("data-name"),e=this.getAttribute("data-url"),f=this.getAttribute("data-cookie"),g=["Data Loading..."];a._renderData(this,{id:b,title:c,name:d,data:g,cookie:a.getCookie(f)});var h=this;$.ajax({method:"GET",url:e,dataType:"json",contentType:"application/json",success:function(e){console.log("%csuccess","background: green; color: white;"),a._renderData(h,{id:b,title:c,name:d,data:e.data,cookie:a.getCookie(f)})},error:function(){console.log("%cerror","background: red; color: white;")}})},b.attachedCallback=function(){console.log("attachedCallback")},document.registerElement("tag-multiSelect",{prototype:b})}};Selector.init(),$("#submit").bind("click",function(a){a.stopPropagation(),a.preventDefault();var b=$(this).parents("form"),c=b.attr("data-cookie"),d=b.serialize();d?Selector.setCookie(c,d,7):alert("请至少选择一项"),alert("已点击查询"+d)});