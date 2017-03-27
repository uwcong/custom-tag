/**
 * 表格组件
 * @author Cc
 * @date 2016/12/15
 */
gbClick = false;
var Table = {
    // 局部变量
    localVal: {
        tableSelf: "",
        staticDataObj: {},
        reqDataObj: {},
        columns: [],
        tableHead: [],
        isSearch: false // 判断是否点击查询
    },

    /**
     * public function 初始化组件
     * 
     */
    init: function() {
        var that = this;
        $('tag-table').each(function() {
            that.localVal.tableSelf = this;
            that.localVal.staticDataObj = JSON.parse($(this).attr('data-staticData'));
            that.localVal.reqDataObj = JSON.parse($(this).attr('data-reqData'));
            if (!that.localVal.reqDataObj.pageSize) that.localVal.reqDataObj.pageSize = 200;
            if (!that.localVal.reqDataObj.currentPage) that.localVal.reqDataObj.currentPage = 1;

            // young.luo
            eval("that.prepareDataFunc = " + $(this).attr('data-prepareDataFunc')); // 额外对请求的数据做处理
            eval("that.afterGetDataFunc = " + $(this).attr('data-afterGetDataFunc')); // 收到数据后回调
        });
    },


    /**
     * public function 请求数据
     * @param {boolean} isTriggered // 判断是否手动触发
     * 
     */
    requestData: function(isTriggered) {
        var that = this;
        var _this = this.localVal.tableSelf,
            _staticDataObj = this.localVal.staticDataObj,
            _reqDataObj = this.localVal.reqDataObj;
        // 读取cookies中form表单的参数
        var reqData = window.PubFunc.getCookie(_staticDataObj.reqCookie);
        if (reqData.hasOwnProperty("undefined")) return false;

        // 点击查询加载表格
        if (isTriggered) {
            this.localVal.isSearch = true;
        }

        // 返回数据前
        window.PubFunc.showLoading();

        // 组装request data，主要是翻页相关的和额外的参数
        for (var _reqDataObjItem in _reqDataObj) {
            reqData[_reqDataObjItem] = _reqDataObj[_reqDataObjItem];
        }

        // young.luo
        if (that.prepareDataFunc) that.prepareDataFunc(_this, reqData);

        $.ajax({
            type: _staticDataObj.ajaxType,
            url: _staticDataObj.url,
            data: JSON.stringify(reqData),
            dataType: "json",
            contentType: "application/json",
            success: function(res) {
                if (res.code === 200) {
                    console.log('%csuccess', 'background: green; color: white;');
                    // 为了延迟看loading
                    setTimeout(function() {
                        window.PubFunc.hideLoading();
                        that._renderTable(reqData, res.data);
                    }, 1500);

                    // young.luo
                    if (that.afterGetDataFunc) {
                        that.afterGetDataFunc(that, res);
                    }
                } else {
                    window.PubFunc.hideLoading();
                    alert(res.msg);
                }
            },
            error: function() {
                console.log('%cerror', 'background: red; color: white;');
            }
        });

    },


    /**
     * private function 渲染表格
     * @param {object} __reqDataObj // 请求参数
     * @param {object} resData // 返回数据
     * 
     */
    _renderTable: function(__reqDataObj, resData) {
        if (resData && resData.head.length > 0) {
            this.localVal.columns = []; // 重置列表表头字段顺序
            // 设置列表表头字段顺序
            var sort = resData.sort;
            for (var i = 0; i < sort.length; i++) {
                this.localVal.columns.push({
                    "data": sort[i]
                })
            }

            // 存储表头
            this.localVal.tableHead = resData.head;

            this._mainTable(__reqDataObj, resData);
        }
    },

    /**
     * private function 渲染表格主体，操作表格
     * @param {object} ___reqDataObj // 请求参数
     * @param {object} _resData  // 返回数据
     * 
     */
    _mainTable: function(___reqDataObj, _resData) {
        var that = this,
            ___this = this.localVal.tableSelf,
            ___staticDataObj = this.localVal.staticDataObj,
            columns = this.localVal.columns;

        // 添加表头
        var excelbtn = "";
        if (___staticDataObj.exportExcel) {
            excelbtn = '<button class="btn btn-success" id="exportExcel">导出Excel</button>';
        }
        var tableToolbar = '<div class="btn-toolbar"><div class="btn-group pull-right focus-btn-group">' + excelbtn + '<button class="btn btn-success showAllColumns">显示所有列</button></div></div>';
        var headTemp = "",
            headData = this.localVal.tableHead;
        for (var i = 0; i < headData.length; i++) {
            headTemp += '<th>' + headData[i] + '<span class="hideColumn" title="隐藏" data-column=' + i + '></span></th>';
        }
        $(___this).html('<div class="m_dataTable">' + tableToolbar + '<table id="' + ___staticDataObj.id + '" class="display dt-bootstrap" cellspacing="0" width="100%"><thead><tr>' + headTemp + '</tr></thead><tbody></tbody></table></div>');

        // 渲染主体
        var dataTableContent = $('#' + ___staticDataObj.id).DataTable({
            "pageLength": this.localVal.reqDataObj.pageSize,
            "searching": false,
            "language": that._dataTableConfig(this.localVal.reqDataObj.pageSize),
            // "order": [[1, "desc"]],
            "ordering": false, // 因为开启了serverSide，所以排序也会发起ajax请求，但又因为只对当前页进行排序，因此要禁用这个排序
            "columns": columns, // 设置列表表头字段顺序
            "processing": true,
            "serverSide": true, //启用服务器端分页
            "ajax": function(data, callback, settings) {
                console.log("%cmaintable", "background: red", data);
                var param = ___reqDataObj;
                param.currentPage = (data.start / data.length) + 1;
                param.pageSize = data.length;

                // young.luo 回调
                if (this.prepareDataFunc) this.prepareDataFunc(__this, param);

                // 点击查询，更新表格
                if (that.localVal.isSearch) {
                    that._getTable(data, _resData, callback);
                    return false;
                }

                console.log('%cpage:', "background: pink", param.currentPage);
                console.log('%clength:', "background: pink", data.length);
                // dataTable本身组件的操作触发，更新表格
                $.ajax({
                    type: ___staticDataObj.ajaxType,
                    url: ___staticDataObj.url,
                    cache: false, //禁用缓存
                    data: JSON.stringify(param), //传入组装的参数
                    dataType: "json",
                    contentType: "application/json",
                    success: function(res) {
                        if (res.code === 200) {
                            console.log("%cmaintableReqSucc", "background: green", res);
                            that._getTable(data, res.data, callback);
                        } else {
                            window.PubFunc.hideLoading();
                            alert(res.msg);
                        }
                    }
                })
            },

        });

        // fixedHeader
        new $.fn.dataTable.FixedHeader(dataTableContent, {
            headerOffset: $('.navbar').height()
        });
        // $.each($('table.fixedHeader-floating th'), function(index, item) {
        //   console.log($(item).width());
        //   var tdItem = $('table.dataTable tbody tr:first-child td')[index];
        //   $(item).width($(tdItem).width());
        // });
        $('table.dataTable').scroll(function() {
            var tableScrollLeft = $(this).scrollLeft();
            $('table.fixedHeader-floating').scrollLeft(tableScrollLeft);
        });

        // 显示隐藏列
        $('.hideColumn').bind('click', function(e) {
            e.stopPropagation();
            dataTableContent.column($(this).attr('data-column')).visible(false);
            that._setTableDynamicStyle();

        });
        $('.showAllColumns').bind('click', function() {
            dataTableContent.columns().visible(true);
            that._setTableDynamicStyle();
        });

        // 每页显示项数
        $('#js_menuLen').bind('keydown', function(e) {
            var menuLenVal = $(this).val();
            if (e.which == "13") dataTableContent.page.len(menuLenVal).draw();
        })

        // 导出Excel
        $('#exportExcel').bind('click', function() {
            if (gbClick) {
                alert("上一个下载任务还在进行中!");
                return;
            }
            // 防止选中后没有点击查询，直接点击导出，所以这里重新组装请求参数
            window.PubFunc.setCookie(___staticDataObj.reqCookie, $('#js_searchFrom').serialize(), 1);
            var reReqData = window.PubFunc.getCookie(___staticDataObj.reqCookie);
            for (var i in that.localVal.reqDataObj) {
                reReqData[i] = that.localVal.reqDataObj[i];
            }
            reReqData['isExportExcel'] = true;

            // young.luo
            if (that.prepareDataFunc) that.prepareDataFunc(___this, reReqData);
            gbClick = true;
            $.ajax({
                type: ___staticDataObj.ajaxType,
                url: ___staticDataObj.url,
                cache: false,
                data: JSON.stringify(reReqData),
                dataType: "json",
                contentType: "application/json",
                success: function(res) {
                    gbClick = false;
                    if (res.code === 200) {
                        alert("文件生成成功: " + res.data.filename);
                        //window.location.href='download_file.do?file='+ res.data.filename + "&type=2";
                        console.log("%cexportExcelDataGet", "background: orange", res);
                    } else {
                        window.PubFunc.hideLoading();
                        alert(res.msg);
                    }
                }
            });
        });
    },


    /**
     * private function 主体数据插入
     * @param {object} dataTableAjaxData // dataTable自带的ajax data
     * @param {object} __resData // 返回数据
     * @param {function} _callback // dataTable回调方法
     * 
     */
    _getTable: function(dataTableAjaxData, __resData, _callback) {
        this.localVal.isSearch = false; // 重置为非点击查询

        var ____staticDataObj = this.localVal.staticDataObj;
        var returnData = {};
        returnData.draw = dataTableAjaxData.draw; //这里直接自行返回了draw计数器,应该由后台返回
        returnData.recordsTotal = __resData.page.recordCount; //返回数据全部记录
        returnData.recordsFiltered = __resData.page.recordCount; //后台不实现过滤功能，每次查询均视作全部结果

        var resList = __resData.page.resList;
        if (__resData.total) resList.push(__resData.total); // 加上“总计”行，用于显示，但不计入pageLength，见上
        returnData.data = resList; //返回的数据列表
        // console.log(returnData);
        //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
        //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
        _callback(returnData);

        // 动态插入数据排序
        $('#' + ____staticDataObj.id).tablesorter((function() {
            return ____staticDataObj.orderColumn || ____staticDataObj.orderColumn === 0 ? {
                sortList: [
                    [____staticDataObj.orderColumn, ____staticDataObj.orderDir]
                ]
            } : {}
        })());

        this._setTableDynamicStyle();
    },


    /**
     * private function 设置表格动态样式
     * 
     */
    _setTableDynamicStyle: function() {
        // 设置table的横向滚动态
        // display: block时才能出现滚动条
        // display: table时才能在内容少的时候自适应宽度撑满table
        if ($('table.dataTable tbody').width() > $('.dataTables_wrapper').width()) {
            $('table.dataTable').css({
                'display': 'block',
                'overflow-x': 'auto'
            })
        } else {
            $('table.dataTable').css({
                'display': 'table'
            })
        }

    },


    /**
     * private object datatable配置
     * 
     */
    _dataTableConfig: function(menuLen) {
        return {
            "sProcessing": "处理中...",
            // "sLengthMenu": "每页 _MENU_ 项",
            "sLengthMenu": '每页 <input type="text" class="form-control" id="js_menuLen" value="' + menuLen + '" /> 项',
            "sZeroRecords": "没有匹配结果",
            "sInfo": "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项",
            "sInfoEmpty": "当前显示第 0 至 0 项，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "表中数据为空",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "末页",
                "sJump": "跳转"
            },
            "oAria": {
                "sSortAscending": ": 以升序排列此列",
                "sSortDescending": ": 以降序排列此列"
            },
        }
    }
}

Table.init();