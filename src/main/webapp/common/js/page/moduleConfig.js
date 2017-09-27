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
            csData.push({id:id,oldModule:'<span title="'+name+'">'+cutStr(name,50)+'</span>',operate:'<button id="showModal'+idaction+'" class="btn btn-info" onclick="showModal(\''+idaction+'\',\''+name+'\')">&nbsp;&nbsp;&nbsp;修改&nbsp;&nbsp;&nbsp;</button>'});
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

// 展示模块修改窗口
function showModal(idaction,name) {
	$("#idaction").val(idaction);
	$("#oldModule").text(name);
    $("#newModule").val(name);
	$("#updateModuleModal").modal('show');
}

// 更新模块名
function updateModal(){
	var idaction = $("#idaction").val();
	var name = $("#newModule").val();
	if(name == null || $.trim(name) == ""){
		alert("模块名不可为空！");
		return;
	}
	ajax("/pla/updateSiteModules.jhtml",{idaction:idaction,name:name},function(data){
		// 更新成功
		if(data == 1){
			// 更新原模块名
			var html = '<span title="'+name+'">'+cutStr(name,50)+'</span>';
			$("#showModal"+idaction).parent("td").prev().html(html);
            $("#showModal"+idaction).click(function(){
            	showModal(idaction,name);
			});
            $("#updateModuleModal").modal('hide');
		}else{
            alert("更新失败，请联系管理员!");
		}
	});
}
// URL详情表end