$(function () {
    // 加载状态为complete时移除loading效果
    if (document.readyState == "complete") {
        document.getElementById('main_loading').style.display = "none";
    }
    else {
        document.getElementById('main_loading').style.display = "block";
    }

    var getprojectmonthlyreportbyprojectmonthlyreportidurl = "monthlyreport/getprojectmonthlyreportbyprojectmonthlyreportid?projectMonthlyReportId="+projectMonthlyReportId;
    var getprojectmonthlyreportshowbytimeUrl = '/monthlyreport/getprojectmonthlyreportshowbytime'; // 根据时间区间获取月报

    getProjectMonthlyReport();

    //  增加一个可以藏起来PID的页面元素 TODO

    function getProjectMonthlyReport() {
        $.ajax({
            url: getprojectmonthlyreportbyprojectmonthlyreportidurl,
            type: 'POST',
            contentType: 'application/json',
            beforeSend:function () {
                $('#loading').show();
            },
            success: function (data) {
                refreshContents(data);
            },
            complete: function () {
                $("#loading").hide();
            },
            error: function (data) {
                console.info("error: " + data.msg);
            }
        });
    }



    $('#last_month').click( function(){
        var lastMonth = $('#year_tag').text()+'-0'+ (parseInt($('#month').text())-1);
        $.ajax({
            url: getprojectmonthlyreportshowbytimeUrl,
            type: 'POST',
            data: JSON.stringify({"time":lastMonth}),
            contentType: 'application/json',
            beforeSend:function () {
                $('#loading').show();
            },
            success: function (data) {
                if (data.code == 1002) {
                    refreshContents(data);
                }
            },
            complete: function () {
                $("#loading").hide();
            },
            error: function (data) {
                console.info("error: " + data.msg);
            }
        });

        $('#animation_box').removeAttr('class').attr('class', '');
        var animation = $(this).attr("data-animation");
        $('#animation_box').addClass('animated');
        $('#animation_box').addClass(animation);
        setTimeout(function(){
            $('#animation_box').removeAttr('class').attr('class', '');
        }, 500);

        // $('#animation_box').delay(2000).removeAttr('class').attr('class', '');
        return false;
    });
    $('#next_month').click( function(){
        var lastMonth = $('#year_tag').text()+'-0'+ (parseInt($('#month').text())+1);
        $.ajax({
            url: getprojectmonthlyreportshowbytimeUrl,
            type: 'POST',
            data: JSON.stringify({"time":lastMonth}),
            contentType: 'application/json',
            beforeSend:function () {
                $('#loading').show();
            },
            success: function (data) {
                if (data.code == 1002) {
                    refreshContents(data);
                }
            },
            complete: function () {
                $("#loading").hide();
            },
            error: function (data) {
                console.info("error: " + data.msg);
            }
        });

        $('#animation_box').removeAttr('class').attr('class', '');
        var animation = $(this).attr("data-animation");
        $('#animation_box').addClass('animated');
        $('#animation_box').addClass(animation);

        setTimeout(function(){
            $('#animation_box').removeAttr('class').attr('class', '');
        }, 500);

        return false;
    });

    $('#mr_show_date .input-group.date').datepicker({
        language: "zh-CN",
        format: 'yyyy-mm',
        minViewMode: 1,
        keyboardNavigation: false,
        forceParse: false,
        forceParse: false,
        autoclose: true,
        todayHighlight: true
    }).on('changeDate',function () {
        var time=$('#input_time').val();
        $.ajax({
            url: getprojectmonthlyreportshowbytimeUrl,
            type: 'POST',
            data: JSON.stringify({"time":time}),
            contentType: 'application/json',
            beforeSend:function () {
                $('#loading').show();
            },
            success: function (data) {
                if (data.code == 1002) {
                    refreshContents(data);
                }
            },
            complete: function () {
                $("#loading").hide();
            },
            error: function (data) {
                console.info("error: " + data.msg);
            }
        });

        $('#animation_box').removeAttr('class').attr('class', '');
        $('#animation_box').addClass('animated');
        $('#animation_box').addClass('shake');

        setTimeout(function(){
            $('#animation_box').removeAttr('class').attr('class', '');
        }, 500);

        return false;
    });

    function refreshContents(data){
        var projectName = data.data.plantName;
        var year = data.data.year;
        var month = data.data.month;
        $('#plantName').text(data.data.plantName);
        $('#year_tag').text(data.data.year);
        $('#month').text(data.data.month+' 月');
        if (data.data.state == 0) {
            $('#state').text("待审核")
        } else if (data.data.state == 1) {
            $('#state').text("已审核");
        } else if (data.data.state == -1) {
            $('#state').text("审核未通过")
        }
        if (data.data.state == 1) {
            $('#check_btn').html('<span class="label label-primary"><i class="fa fa-check"></i> 已审批通过</span>');
        } else if (data.data.state == -1) {
            $('#check_btn').html('<span class="label label-danger"><i class="fa fa-times"></i> 已拒绝</span>');
        } else {
            $('#check_btn').html('<a id="" class="btn btn-danger btn-facebook animation_select" data-toggle="modal" data-target="#approve_modal">\n' +
                '                审批\n' +
                '                </a>');
        }
        $('#submitter').text(data.data.submitter);
        $('#submitTime').text(data.data.createTime);
        data.data.state == 0 ? $('#state_bar').css("width", "50%") : $('#state_bar').css("width", "100%");
        if (data.data.state == 0) {
            $('#state_msg').text("等待上级审批")
        } else if (data.data.state == 1) {
            $('#state_msg').text("已通过")
        } else if (data.data.state == -1) {
            $('#state_msg').text("未通过")
        }
        if (data.data.state == -1) {
            $('#tabbtn').append('');
        } else {
            if ($('#mr_table')) {
                $('#mr_table').remove();
            }
            $('#tabbtn').append('<li class=""><a data-toggle="modal" id="mr_table"> <i class="fa fa-pie-chart"></i>月报表</a></li>')
            $('#tabbtn').on('click', '#mr_table', function (e) {
                var  labelItemListDataTable = $('.dataTables-example').dataTable();
                labelItemListDataTable.fnClearTable();
                labelItemListDataTable.fnDestroy();
                $.ajax({
                    url: 'monthlyreport/getmonthlyreportexcelbyprojectid',
                    type: 'GET',
                    data: {projectMonthlyReportId: $('#plantName').attr('projectMonthlyReportId')
                        ,currentDate: $('#year_tag').text()+'-0'+ (parseInt($('#month').text()))},
                    contentType: 'application/json',
                    beforeSend:function () {
                        $('#loading').show();
                    },
                    success: function (data) {
                        if (data.code == 1002){
                            $('#data_table_modal').modal();
                            $('.dataTables-example').DataTable({
                                language: {
                                    "sProcessing": "处理中...",
                                    "sLengthMenu": "显示 _MENU_ 项结果",
                                    "sZeroRecords": "没有匹配结果",
                                    "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                                    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                                    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                                    "sInfoPostFix": "",
                                    "sSearch": "搜索:",
                                    "sUrl": "",
                                    "sEmptyTable": "表中数据为空",
                                    "sLoadingRecords": "载入中...",
                                    "sInfoThousands": ",",
                                    "oPaginate": {
                                        "sFirst": "首页",
                                        "sPrevious": "上页",
                                        "sNext": "下页",
                                        "sLast": "末页"
                                    },
                                    "oAria": {
                                        "sSortAscending": ": 以升序排列此列",
                                        "sSortDescending": ": 以降序排列此列"
                                    }
                                },
                                bFilter: false,    //去掉搜索框
                                retrieve: true,
                                destroy:true,
                                bInfo:false,       //去掉显示信息
                                data:data.data,
                                paging: false,
                                ordering:false,
                                bAutoWidth:true,
                                lengthChange: false,
                                responsive: true,
                                dom: '<"html5buttons"B>lTfgitp',
                                buttons: [
                                    {extend: 'copy'},
                                    {extend: 'csv'},
                                    {extend: 'excel', title: '水库项目基本信息'},
                                    {
                                        "extend": 'pdf',
                                        'title': projectName+'月报('+year+'-'+month+')', //导出文件名字
                                        "filename": "*",
                                        'text': 'PDF预览', //定义导出excel按钮的文字
                                        "aButtons": "true",
                                        "sCharSet": "utf8",
                                        "download": "open",
                                        'header': true,
                                    },
                                    {
                                        "extend": 'pdf',
                                        'title': projectName+'月报('+year+'-'+month+')', //导出文件名字
                                        "filename": "*",
                                        'text': 'PDF导出', //定义导出excel按钮的文字
                                        "aButtons": "true",
                                        "sCharSet": "utf8",
                                        'header': true,
                                    },
                                    {extend: 'print',
                                        "title": projectName+'月报('+year+'-'+month+')',
                                        customize: function (win){
                                            $(win.document.body).addClass('white-bg');
                                            $(win.document.body).css('font-size', '10px');

                                            $(win.document.body).find('table')
                                                .addClass('compact')
                                                .css('font-size', 'inherit');
                                        }
                                    }
                                ]
                            });
                        }
                    },
                    complete: function () {
                        $("#loading").hide();
                    },
                    error: function (data) {
                        console.info("error: " + data.msg);
                    }
                });
                $('#data_table_modal').modal('show');
                $('#dismiss_modal').click(function () {
                    $('#data_table_modal').modal('hide');
                })
            })
        }
        $('#statisticalLeader').text(data.data.statisticalLeader);
        $('#civilEngineering').text(data.data.civilEngineering);
        $('#electromechanicalEquipment').text(data.data.electromechanicalEquipment);
        $('#metalMechanism').text(data.data.metalMechanism);
        $('#temporaryWork').text(data.data.temporaryWork);
        $('#independentCost').text(data.data.independentCost);
        $('#reserveFunds').text(data.data.reserveFunds);
        $('#resettlementArrangement').text(data.data.resettlementArrangement);
        $('#waterConservation').text(data.data.waterConservation);
        $('#environmentalProtection').text(data.data.environmentalProtection);
        $('#otherCost').text(data.data.otherCost);
        $('#sourceCentralInvestment').text(data.data.sourceCentralInvestment);
        $('#sourceProvincialInvestment').text(data.data.sourceProvincialInvestment);
        $('#sourceLocalInvestment').text(data.data.sourceLocalInvestment);
        $('#availableCentralInvestment').text(data.data.availableCentralInvestment);
        $('#availableProvincialInvestment').text(data.data.availableProvincialInvestment);
        $('#availableLocalInvestment').text(data.data.availableLocalInvestment);
        $('#openDug').text(data.data.openDug);
        $('#holeDug').text(data.data.holeDug);
        $('#backfill').text(data.data.backfill);
        $('#grout').text(data.data.grout);
        $('#masonry').text(data.data.masonry);
        $('#concrete').text(data.data.concrete);
        $('#rebar').text(data.data.rebar);
        $('#report_year').text(data.data.year);
        $('#report_month').text(data.data.month);
        $('#labourForce').text(data.data.labourForce);
        $('#constructionContent').text(data.data.constructionContent);
        $('#remark').text(data.data.remark);
        $('#visualProgress').text(data.data.visualProgress);
        $('#difficulty').text(data.data.difficulty);
        $('#measure').text(data.data.measure);
        $('#suggestion').text(data.data.suggestion);
        $('#plantName').attr('projectMonthlyReportId', data.data.projectMonthlyReportId);
        var projectMonthlyReportImgVOList = data.data.projectMonthlyReportImgVOList;
        var file_display_html = '';
        projectMonthlyReportImgVOList.map(function (item, index) {
            file_display_html += '<div class="file-box">\n' +
                '                                                                                    <div class="file">\n' +
                '                                                                                        <span class="corner"></span>\n' +
                '                                                                                        <div class="image" style="background:url(' + item.thumbnailAddr + ');background-size:cover;">\n' +
                '                                                                                        </div>\n' +
                '                                                                                        <div class="file-name">\n' +
                '                                                                                            文件\n' +
                '                                                                                            <br/>\n' +
                '                                                                                            <small>'+ item.createTime +'</small>\n' +
                '                                                                                            <a type="button" class="btn-primary pull-right" href="/download/monthlyreportfile?fileId='+item.imgAddr+'">下载</a>\n' +
                '                                                                                        </div>\n' +
                '                                                                                    </div>\n' +
                '                                                                                </div>'
        });
        $('#files_display_div').html("");
        $('#files_display_div').html(file_display_html);
    }


    $("[name='my-checkbox']").bootstrapSwitch({
        onText : "拒绝",
        offText : "通过",
        onColor : "danger",
        offColor : "success",
        size : "large",
        onSwitchChange : function() {
            var checkedOfAll=$("#my-checkbox").prop("checked");
            if (checkedOfAll==false){
                $('#approve_input').hide()
            }
            else {
                $('#approve_input').show()
            }
        }
    });

    $('#submit').click(function () {
        var switchState = $("#my-checkbox").prop("checked");  // true: 按钮为通过 false：按钮通过
        var checkinfo = $('#approve_area').val();
        var projectMonthlyReportId = $('#plantName').attr("projectmonthlyreportid");
        $.ajax({
            url: "monthlyreport/approvemonthlyreport",
            type: 'POST',
            data: JSON.stringify({"switchState":switchState, "checkinfo":checkinfo, "projectMonthlyReportId":projectMonthlyReportId}),
            contentType: 'application/json',
            beforeSend:function () {
                $('#loading').show();
            },
            success: function (data) {
                if (data.code == 1002) {
                    $('#monthly_report_check_div').html('');
                    $('#monthly_report_check_div').html('<div class="modal-header"><h1 class="modal-title">操 作 成 功</h1></div> <div class="modal-footer">\n' +
                        '                <button type="button" id="check_result_confirm_btn" class="btn btn-white" data-dismiss="modal">确定</button>\n' +
                        '            </div>');
                } else {
                    $('#monthly_report_check_div').html('');
                    $('#monthly_report_check_div').html('<div class="modal-header"><h1 class="modal-title">操 作 出 错</h1></div>   <div class="modal-body">\n' +
                        '                <div class="form-group animated fadeIn" ><label style="font-size: 15px;">'+ data.msg +'</label></div>\n' +
                        '            </div><div class="modal-footer">\n' +
                        '                <button type="button" id="check_result_confirm_btn" class="btn btn-white" data-dismiss="modal">确定</button>\n' +
                        '            </div>');
                }
            },
            complete: function () {
                $("#loading").hide();
            },
            error: function (data) {
                console.info("error: " + data.msg);
            }
        });
    });
    $('#monthly_report_check_div').on('click', '#check_result_confirm_btn', function (e) {
        $('#main_content', parent.document).load('reporter/projectmonths');
    });


})