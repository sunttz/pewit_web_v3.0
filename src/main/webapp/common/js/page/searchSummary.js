var urlSummary = null; // url概览数据,切换时间刷新
var urlDetail = null; // url详情数据,切换时间刷新

$(function(){
	idSite = getQueryString("siteId");
	t = getQueryString("t");
    initDateCondition(); // 初始化时间
	$("[data-toggle='tooltip']").tooltip();
	
	// 初始化url趋势图
	var urlTrendChart = null;
	init_visit();


});

// 查询条件切换
function searchChange(condition) {
	if(condition == "module"){
		$("#searchText").text("功能模块");
		$("#searchType").val("module");
		$("#searchModule").show();
		$("#searchUrl").hide();
	}else if(condition == "url"){
        $("#searchText").text("受访URL");
        $("#searchType").val("url");
        $("#searchModule").hide();
        $("#searchUrl").show();
	}
}

// 点击查询操作
function searchSubmit() {
    ajaxModuleUrl();
}

// 初始化时间
function initDateCondition(){
    var year,month;
    var currDate = new Date();
    year = currDate.getFullYear();
    month = currDate.getMonth()+1;
	// 查询3个月前
    switch(month) {
        case 1:
        case 2:
        case 3:
            month += 9;
            year--;
            break;
        default:
            month -= 3;
            break;
    }
    // 循环出前三个月年月日
	var dateDiv = "";
    for(var i=0;i<3;i++){
    	var monthTmp = month+i;
    	var yearTmp = year;
    	var dateTmp;
		if(monthTmp > 12){
            monthTmp = monthTmp - 12;
            yearTmp++;
		}
		switch(monthTmp){
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				dateTmp = '31';
				break;
			default:
				dateTmp = '30';
				break;
		}
        dateDiv += '<button type="button" class="btn btn-default btn-sm';
		if(i == 2){
            dateDiv += ' active';
            // 设置默认为上个月
            $("#dateKind").val(monthTmp);
            var month2 = (monthTmp < 10)?('0' + monthTmp):monthTmp;
            var startDate = yearTmp+'-'+month2+'-01';
            var endDate = yearTmp+'-'+month2+'-'+dateTmp;
            $("#startDate").val(startDate);
            $("#endDate").val(endDate);
		}
        dateDiv += '" year="'+yearTmp+'" month="'+monthTmp+'" day="'+dateTmp+'">'+monthTmp+'月</button>';
	}
	$("#dateDiv").prepend(dateDiv);
    //时间切换
    $("#dateDiv button").click(function() {
        var year = $(this).attr("year");
        var month = $(this).attr("month");
        var day = $(this).attr("day");
        $("#dateDiv .btn").removeClass("active");
        $("#dateDiv .btn[month="+month+"]").addClass("active");
        $("#startDate").val("");
        $("#endDate").val("");
        $("#dateKind").val(month);
        month = (month < 10)?('0' + month):month;
        var startDate = year+'-'+month+'-01';
        var endDate = year+'-'+month+'-'+day;
        $("#startDate").val(startDate);
        $("#endDate").val(endDate);
        ajaxModuleUrl();
    });
}

// 结束时间选择事件
function dateSelect(){
    $("#dateDiv .btn").removeClass("active");
    ajaxModuleUrl();
}

// 图表自适应
window.onresize = function(){
	urlTrendChart.resize();
}

// 请求模块/url数据
function ajaxModuleUrl() {
    var searchType = $("#searchType").val(); // 查询类型
    var searchVal = ""; // 查询值
    if(searchType == "module"){
        searchVal = $("#searchModule").val();
    }else if(searchType == "url"){
        searchVal = $("#searchUrl").val();
    }
    if(searchVal == null || searchVal == ""){
        alert("查询条件不可为空！");
        return;
    }
    $("#searchVal").text("【"+cutStr(searchVal,50)+"】");
	if(searchType == "url"){
        ajaxUrlData(searchVal);
	}else if(searchType == "module"){

	}
}

// URL统计方法start
// 刷新当前url趋势数据
function ajaxUrlData(url){
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	var p1 = "module=API&method=Actions.getPageUrl&pageUrl="+url+"&idSite="+idSite+"&period=range&date="+startDate+","+endDate+"&format=JSON&token_auth="+t;
	var p2 = "module=API&method=Actions.getPageUrl&pageUrl="+url+"&idSite="+idSite+"&period=day&date="+startDate+","+endDate+"&format=JSON&token_auth="+t;
	var urls = new Array();
	urls.push(encodeURI(p1));
	urls.push(encodeURI(p2));
	var p = getBulkRequestParam(urls);
	ajax_jsonp(piwik_url,p,function(data){
		// 展示url视图
		$("#noData,#searchModuleData").hide();
        $("#searchUrlData,.main-content").show();
        urlTrendChart.resize();
		data = eval(data);
		urlSummary = data[0];
		urlDetail = data[1];
		ana_visit_summary(); // 加载url概览图
		ana_visit();// 加载url趋势图
		anaCsTable(); // 加载访客数据表
	});
}

// url趋势图start
// 加载url概览图
function ana_visit_summary(){
	if(urlSummary.length == 0){
		$("#d_nh").html("0");
		$("#d_nv").html("0");
		$("#d_atop").html("00:00:00");
		$("#d_br").html("0%");
		$("#d_er").html("0%");
		$("#d_atg").html("0");
	}else{
		var d = urlSummary[0];
		$("#d_nh").html(d.nb_hits);
		$("#d_nv").html(d.nb_visits);
		$("#d_atop").html(formatTime(d.avg_time_on_page));
		$("#d_br").html(d.bounce_rate);
		$("#d_er").html(d.exit_rate);
		$("#d_atg").html(d.avg_time_generation);
	}
}
// 初始化url趋势图
function init_visit(){
	urlTrendChart = echarts.init(document.getElementById('urlTrend'));
	var option = {
	    title: {},
	    tooltip: {trigger: 'axis',},
	    legend: {bottom : '6%'},
	    grid: {left: '8%',right: '8%',top: '5%',containLabel: true},
	    toolbox: {feature: {}},
	    xAxis: {type: 'category',boundaryGap: false},
	    yAxis: {type: 'value'},
	    series: []
	};
	urlTrendChart.setOption(option);
}
//加载url趋势图
function ana_visit(){
	var urlTendencyIndex = $("#urlTendencyIndex").val(); // 指标
	var option = {};
	urlTrendChart.showLoading();
	// 浏览量(PV)
	if("nh"==urlTendencyIndex){
		var categories = new Array();
		var datas = new Array();
		for(var k in urlDetail){
			categories.push(k);
			if(urlDetail[k].length == 0){
				datas.push(0);
			}else{
				datas.push(urlDetail[k][0].nb_hits);
			}
		}
		option = {
			legend: {data:["浏览量(PV)"]},
			tooltip:{formatter:function(params){return params[0].name + ' <br/>' + params[0].seriesName + ": " + params[0].value;}},
	    		xAxis: {data:categories},
	    		yAxis: {axisLabel:{formatter: '{value}'}},
	    		series:[{name:'浏览量(PV)',type:'line',stack: '浏览量(PV)',itemStyle:{normal:{color: '#87CEEB',lineStyle:{color:'#87CEEB'}}},
	            areaStyle: {normal: {color:'#87CEEB'}},data:datas
	    		}]
		};
		urlTrendChart.hideLoading();
		urlTrendChart.setOption(option);
	}
	// 唯一页面浏览量
	else if("nv"==urlTendencyIndex){
		var categories = new Array();
		var datas = new Array();
		for(var k in urlDetail){
			categories.push(k);
			if(urlDetail[k].length == 0){
				datas.push(0);
			}else{
				datas.push(urlDetail[k][0].nb_visits);
			}
		}
		option = {
			legend: {data:["唯一页面浏览量"]},
			tooltip:{formatter:function(params){return params[0].name + ' <br/>' + params[0].seriesName + ": " + params[0].value;}},
	    		xAxis: {data:categories},
	    		yAxis: {axisLabel:{formatter: '{value}'}},
	    		series:[{name:'唯一页面浏览量',type:'line',stack: '唯一页面浏览量',itemStyle:{normal:{color: '#87CEEB',lineStyle:{color:'#87CEEB'}}},
	            areaStyle: {normal: {color:'#87CEEB'}},data:datas
	    		}]
		};
		urlTrendChart.hideLoading();
		urlTrendChart.setOption(option);
	}
	// 平均访问时长
	else if("atop" == urlTendencyIndex){
		var categories = new Array();
		var datas = new Array();
		for(var k in urlDetail){
			categories.push(k);
			if(urlDetail[k].length == 0){
				datas.push(0);
			}else{
				datas.push(urlDetail[k][0].avg_time_on_page);
			}
			
		}
		option = {
			legend: {data:["平均访问时长"]},
			tooltip:{formatter:function(params){return params[0].name + ' <br/>' + params[0].seriesName + ": " + formatTime(params[0].value);}},
	    		xAxis: {data:categories},
	    		yAxis: {axisLabel:{formatter: '{value}'}},
	    		series:[{name:'平均访问时长',type:'line',stack: '平均访问时长',itemStyle:{normal:{color: '#87CEEB',lineStyle:{color:'#87CEEB'}}},
	            areaStyle: {normal: {color:'#87CEEB'}},data:datas
	    		}]
		};
		urlTrendChart.hideLoading();
		urlTrendChart.setOption(option);
	}
	// 跳出率
	else if("br" == urlTendencyIndex){
		var categories = new Array();
		var datas = new Array();
		for(var k in urlDetail){
			categories.push(k);
			var br = urlDetail[k];
			if(br.length == 0){
				datas.push("0");
			}else{
				var s = br[0].bounce_rate;
				datas.push(s.substr(0,s.length-1));
			}
		}
		option = {
			legend: {data:["跳出率"]},
			tooltip:{formatter:function(params){return params[0].name + ' <br/>' + params[0].seriesName + ": " + params[0].value + '%';}},
	    		xAxis: {data:categories},
	    		yAxis: {axisLabel:{formatter: '{value}%'}},
	    		series:[{name:'跳出率',type:'line',stack: '跳出率',itemStyle:{normal:{color: '#87CEEB',lineStyle:{color:'#87CEEB'}}},
	            areaStyle: {normal: {color:'#87CEEB'}},data:datas
	    		}]
		};
		urlTrendChart.hideLoading();
		urlTrendChart.setOption(option);
	}
	// 退出率
	else if("er" == urlTendencyIndex){
		var categories = new Array();
		var datas = new Array();
		for(var k in urlDetail){
			categories.push(k);
			var er = urlDetail[k];
			if(er.length == 0){
				datas.push("0");
			}else{
				var s = er[0].exit_rate;
				datas.push(s.substr(0,s.length-1));
			}
		}
		option = {
			legend: {data:["退出率"]},
			tooltip:{formatter:function(params){return params[0].name + ' <br/>' + params[0].seriesName + ": " + params[0].value + '%';}},
	    		xAxis: {data:categories},
	    		yAxis: {axisLabel:{formatter: '{value}%'}},
	    		series:[{name:'退出率',type:'line',stack: '退出率',itemStyle:{normal:{color: '#87CEEB',lineStyle:{color:'#87CEEB'}}},
	            areaStyle: {normal: {color:'#87CEEB'}},data:datas
	    		}]
		};
		urlTrendChart.hideLoading();
		urlTrendChart.setOption(option);
	}
	// 页面性能响应(秒)
	else if("atg" == urlTendencyIndex){
		var categories = new Array();
		var datas = new Array();
		for(var k in urlDetail){
			categories.push(k);
			if(urlDetail[k].length == 0){
				datas.push(0);
			}else{
				datas.push(urlDetail[k][0].avg_time_generation);
			}
		}
		option = {
			legend: {data:["页面性能响应"]},
			tooltip:{formatter:function(params){return params[0].name + ' <br/>' + params[0].seriesName + ": " + params[0].value + '秒';}},
	    		xAxis: {data:categories},
	    		yAxis: {axisLabel:{formatter: '{value}秒'}},
	    		series:[{name:'页面性能响应',type:'line',stack: '页面性能响应',itemStyle:{normal:{color: '#87CEEB',lineStyle:{color:'#87CEEB'}}},
	            areaStyle: {normal: {color:'#87CEEB'}},data:datas
	    		}]
		};
		urlTrendChart.hideLoading();
		urlTrendChart.setOption(option);
	}
}

// 指标按钮点击事件
function urlTendency_btn(index){
	$("#urlTendency_btn_text").text("指标："+$("#btn_"+index).text());
	$("#urlTendencyIndex").val(index);
	ana_visit(); // 刷新url趋势图
}
// 访客趋势图end

// url指标详情表start
// 解析数据并加载
function anaCsTable(){
	var csData = [];
	for(var k in urlDetail){
		var v = urlDetail[k];
		if(v.length == 0){
			csData.push({time:k,pv:0,nv:0,atop:'00:00:00',br:'0%',er:'0%',atg:0});
		}else{
			var row = v[0];
			csData.push({time:k,pv:row.nb_hits,nv:row.nb_visits,atop:formatTime(row.avg_time_on_page),br:row.bounce_rate,er:row.exit_rate,atg:row.avg_time_generation});	
		}
	};
	initCsTable(csData);
}
// 构造表格数据
function initCsTable(csData){
	var cs = new table({
		"tableId": "cs_table", //必须
		"headers": ["日期", "浏览量", "唯一页面浏览量", "平均访问时长", "跳出率","退出率","页面性能响应(秒)"], //必须
		"customHeader" : "<thead><tr><th rowspan='2'>日期</th><th colspan='2'>网站基础指标</th><th colspan='4'>流量质量指标</th></tr><tr><th>浏览量</th><th>唯一页面浏览量</th><th>平均访问时长</th><th>跳出率</th><th>退出率</th><th>页面性能响应(秒)</th></tr></thead>", // 自定义表头，若定义则覆盖默认表头
		"data": csData.reverse(), //必须
		"displayNum": 15, //必须  默认 10
		"groupDataNum": 9 //可选  默认 10
	});
}
// url指标详情表end
// URL统计方法end