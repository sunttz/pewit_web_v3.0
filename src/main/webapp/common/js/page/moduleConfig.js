$(function(){
	idSite = getQueryString("siteId");
	t = getQueryString("t");
    ajaxCsTable();
});


// URL详情表start
// 请求数据并加载
function ajaxCsTable(){
	var csData = [];
	ajax("/pla/getSiteModules.jhtml",{idsite:idSite},function(data){
		data = eval(data);
		for(var i in data){
			var module = data[i];
			var id = module.id;
			var name = module.name;
			var idaction = module.idaction;
            csData.push({id:id,oldModule:'<span title="'+name+'">'+cutStr(name,50)+'</span>',operate:'<button class="btn btn-info">&nbsp;&nbsp;&nbsp;修改&nbsp;&nbsp;&nbsp;</button>'});
		}
        initCsTable(csData);
	});

}
// 构造表格数据
function initCsTable(csData){
	var cs = new table({
		"tableId": "cs_table", //必须
		"headers": ["序号","原受访模块","操作"], //必须
		"data": csData, //必须
		"displayNum": 15, //必须  默认 10
		"groupDataNum": 9 //可选  默认 10
	});
}
// URL详情表end