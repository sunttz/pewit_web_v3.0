var visitModuleData = null; // 受访页面模块原始数据
$(function(){
	idSite = getQueryString("siteId");
	t = getQueryString("t");
	label = decodeURIComponent(getQueryString("label"));
	sd = getQueryString("sd");
	ed = getQueryString("ed");
	idSubtable = getQueryString("idSubtable");
	// 设置默认
	$("#subModualTitle").html(cutStr(label,80)); 
	$("#returnHp").bind("click",function(){
		window.location.href = "visitPageTitle.html?siteId="+idSite+"&t="+t;
	});
	$("#date").html(sd+" ~ "+ed);
	
	var visitModulePieChart = null;
	init_pie();
	var visitModuleBarChart = null;
	init_bar();
	ajax_visitModule(); // 获取受访页面模块数据
	
});
// 图表自适应
window.onresize = function(){
	visitModulePieChart.resize();
	visitModuleBarChart.resize();
}

// ajax请求受访页面模块数据
function ajax_visitModule(){
	var startDate = sd;
	var endDate = ed;
	var	param = {module:'API',method:'Actions.getPageTitles',idSite:idSite,period:'range',date:startDate+','+endDate,format:'json',token_auth:t,flat:'0',filter_sort_column:'nb_hits',filter_sort_order:'desc',idSubtable:idSubtable};
	visitModulePieChart.showLoading();
	visitModuleBarChart.showLoading();
	ajax_jsonp(piwik_url,param,function(data){
		data = eval(data);
		visitModuleData = data;
		console.info(visitModuleData);
		anaPieBar(); // 加载图表
		anaCsTable(); // 加载详情表格
	});
}

// 初始化饼图
function init_pie(){
	visitModulePieChart = echarts.init(document.getElementById('visitModulePie'));
	var option = {
	    tooltip : {
	        trigger: 'item',
	        formatter: "{b} <br/>{a} : {c} ({d}%)"
	    },
	    legend: {
	    		show : false,
	        data: []
	    },
	    series : [
	        {
	            name: '访问',
	            type: 'pie',
	            radius : '55%',
	            center: ['55%', '50%'],
	            data:[],
	            itemStyle: {
	            		normal: {
						label: {
							show: true,
							formatter: '{d}%'
						},
						labelLine: {
							show: true
						},
					},
	                emphasis: {
	                    shadowBlur: 10,
	                    shadowOffsetX: 0,
	                    shadowColor: 'rgba(0, 0, 0, 0.5)'
	                }
	            }
	        }
	    ]
	};
	visitModulePieChart.setOption(option);
}

// 初始化柱状图
function init_bar(){
	visitModuleBarChart = echarts.init(document.getElementById('visitModuleBar'));
	var option = { 
	    tooltip : {
	        trigger: 'axis',
	        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
	            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
	        }
	    },
	    grid: {
			y2 : 100
	    },
	    xAxis : [
	        {
	            type : 'category',
	            data : [],
	            axisTick: {
	                alignWithLabel: true
	            },
	            axisLabel:{  
                     interval: 0,//横轴信息全部显示  
                     rotate:-20,//-30度角倾斜显示  
                }
	        }
	    ],
	    yAxis : [{type : 'value'}],
	    series : [{
		            name:'访问',
		            type:'bar',
		            barWidth: '60%',
		            data:[],
		            itemStyle: {
						normal: {
							color: function(params) {
								var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
								return colorList[params.dataIndex]
							},
							label: {
								show: false
							}
						}
					}
		       }]
	};
	visitModuleBarChart.setOption(option);
}

// 解析图表数据
function anaPieBar(){
	// 如果超过10条记录，则只展示前10条，余下展示其他
	var vmd = visitModuleData;
	if(vmd.length > 10){
		vmd = vmd.slice(0,10);
		var nh = 0;
		for(var i = 10; i < visitModuleData.length; i++){
			nh += visitModuleData[i].nb_hits;
		}
		vmd.push({label:'其他',nb_hits:nh});
	}
	var xData = [];
	var pieData = [];
	var barData = [];
	for(var k in vmd){
		var row = vmd[k];
		var label = row.label;
		var nh = row.nb_hits;
		xData.push(cutStr(label,30));
		pieData.push({value:nh,name:cutStr(label,30)});
		barData.push(nh);
	}
	var pieOption = {
		legend: {
	        data: xData
	    },
	    series : [{
	        data: pieData,
	    }]
	}
	visitModulePieChart.setOption(pieOption);
	visitModulePieChart.hideLoading();
	var barOption = {
		xAxis : [{
	       data : xData,
	    }],
	    series : [{
	       data:barData
	    }]
	};
	visitModuleBarChart.setOption(barOption);
	visitModuleBarChart.hideLoading();
}

// 指标详情表start
// 解析数据并加载
function anaCsTable(){
	var csData = [];
	for(var k in visitModuleData){
		var row = visitModuleData[k];
		var labelFormat = "<span title='"+row.label+"'>"+cutStr(row.label,80)+"</span>";
		//  如果有子模块展示查看详情按钮
		var plus = "";
		var moduleName = label + "/" + $.trim(row.label);
		if(row.hasOwnProperty("idsubdatatable")){
			var sub = row.idsubdatatable;
			plus = "<a href='visitPageTitleSub.html?idSubtable="+sub+"&sd="+sd+"&ed="+ed+"&siteId="+idSite+"&t="+t+"&label="+encodeURIComponent(moduleName)+"' title='查看详情'><span class='glyphicon glyphicon-chevron-right'></span></a>";
		}else{
			var href = "moduleUpDown.html?siteId="+idSite+"&t="+t+"&startDate="+sd+"&endDate="+ed+"&module="+encodeURIComponent(moduleName);
			plus = "<a href='"+href+"' title='查看模块上下游'><span class='glyphicon glyphicon-random'></span></a>";
            labelFormat = '<a href="../searchSummary.html?pageTitle='+encodeURIComponent(moduleName)+'&siteId='+idSite+'&t='+t+'" title="'+moduleName+'">'+cutStr(row.label,80)+'</a>';
		}
		var nh = row.nb_hits;
		var nv = row.nb_visits;
		var atop = formatTime(row.avg_time_on_page);
		var br = row.bounce_rate;
		var er = row.exit_rate;
		var atg = row.avg_time_generation;
		csData.push({label:labelFormat,plus:plus,nh:nh,nv:nv,atop:atop,br:br,er:er,atg:atg});
	}
	initCsTable(csData);
}
// 构造表格数据
function initCsTable(csData){
	var	customHeader = "<thead>"
						+"<tr><th rowspan='2' colspan='2'>受访页面模块</th><th colspan='2'>网站基础指标</th><th colspan='4'>流量质量指标</th></tr>"
						+"<tr><th title='页面被查看的次数。用户多次打开同一页面，浏览量值累计。'>浏览量</th>"
						+"<th title='浏览了该页面的访问次数。如果一次访问中多次浏览同一页面，只统计一次。'>唯一页面浏览量</th>"
						+"<th title='访客在一次访问中，平均打开网站的时长。'>平均访问时长</th>"
						+"<th title='只查看单个页面的百分比，即访客直接从入口页面离开网站。'>跳出率</th>"
						+"<th title='查看该页面后离开网站的百分比。'>退出率</th>"
						+"<th title='生成页面的平均时间。'>平均生成时长(秒)</th>"
						+"</tr></thead>";
	var cs = new table({
		"tableId": "cs_table", //必须
		"headers": ["受访页面模块", "", "浏览量", "唯一页面浏览量", "平均访问时长", "跳出率","退出率","平均生成时长(秒)"], //必须
		"customHeader" : customHeader, // 自定义表头，若定义则覆盖默认表头
		"data": csData, //必须
		"displayNum": 15, //必须  默认 10
		"groupDataNum": 9 //可选  默认 10
	});
}
// 指标详情表end