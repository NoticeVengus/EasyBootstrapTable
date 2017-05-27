/**
 * @author 		YeYe
 * @date 		2017.5.27
 * @version		0.0.6
 * @require		
				jQuery1.6+(http://jquery.com/)
				BootstrapV2+(https://getbootstrap.com/)
				BootstrapTableV1+(http://bootstrap-table.wenzhixin.net.cn/)
 * 自行编写的Bootstrap自定义表格
 */

(function($) {
	
	$.fn.extend({
		"bootstrapCustomTable" : function(options){
			
			var _options;
			var cPage=1;		// 当前页数
			
			var isInit = false;
			var that;
			
			// 如果用户没有配置idlist，则清空内置的idlist
			if(typeof($(this).context._options)==='undefined' && typeof(options.idlist)==='undefined')
				defaults.idlist.list=[];
			options = $.extend({}, defaults, options);
			_options = options;
			//console.log("options2="+JSON.stringify(options.idlist.list));
			// 如果不维护分页，则当前分页为用户输入的分页编号
			if(!_options.maintainPage)
				cPage = _options.pageNumber;
			// 检查必须配置的数据项
			if(options.url==null || options.columnsData==null)
				return false;
			// 销毁表格
			$(this).bootstrapTable('destroy');
			// 构造表格数据
			var col = new Array();
			if(_options.checkbox){
				var check = new Object();
				check.checkbox = true;
				col.push(check);
			}
			if(options.fieldData==null){
				for(var i=0;i<options.columnsData.length;++i){
					var obj = new Object();
					obj.field = options.columnsData[i].name;
					obj.title = options.columnsData[i].name;
					obj.align = 'center';
					obj.visible = typeof(options.columnsData[i].hide)!='undefined'? options.columnsData[i].hide : true;
					col.push(obj);
				}
			}
			else{
				for(var i=0;i<options.columnsData.length;++i){
					var obj = new Object();
					obj.field = options.fieldData[i];
					obj.title = options.columnsData[i].name;
					obj.align = 'center';
					obj.visible = typeof(options.columnsData[i].hide)!='undefined'? !options.columnsData[i].hide : true;
					col.push(obj);
				}
			}
			// 表格配置
			$(this).bootstrapTable({
				url:options.url,
				method: 'post',
				height:600,
				showColumns:false,				// 是否显示 内容列下拉框，即右上角的内容选择按钮
				search:_options.enableSearch,	// 是否启用搜索框
				showRefresh:_options.showRefresh,	// 是否显示 刷新按钮
				showToggle:false,				// 是否显示 切换试图（table/card）按钮 
				pagination:true,				// 设置为 true 会在表格底部显示 分页条
				maintainSelected:true,			// 设置为 true 在点击分页按钮或搜索按钮时，将记住checkbox的选择项
				cache:true,						// 设置为 true 禁用 AJAX 数据缓存
				sortable:false,					// 设置为false 将禁止所有列的排序
				sidePagination:'server',		// 设置在哪里进行分页，可选值为 'client' 或者 'server'。设置 'server'时，必须设置 服务器数据地址（url）或者重写ajax方法
				pageNumber:cPage, 				// 如果设置了分页，首页页码
				pageSize: 10,			// 如果设置了分页，页面数据条数
				pageList: [10, 25, 50, 100], 	// 如果设置了分页，设置可供选择的页面数据条数。设置为All 则显示所有记录。
				singleSelect: !options.isMultiSelect,
				clickToSelect: options.isClickToSelect,
				undefinedText: '无数据',	// 当数据为 undefined 时显示的字符
				uniqueId: "id",
				// 请求附加参数
				queryParams: options.queryParams ,
				// 行风格
				rowStyle: options.rowStyle,
				columns: col
			});
			
			that = $(this);
			
			if(!isInit){
				
				// 搜索框hint
				$('#bootstrap-table-search-input').attr('placeholder', options.searchText);
				
				// 勾选监听器
				$(this).on('check.bs.table', function (event, row) {
					// 如果idlist没有这个ID，则添加进去
					for(var i=0;i<options.idlist.list.length;++i){
						for (var key in row){
							if(key==options.idlist.key && row[key]==options.idlist.list[i].id){
								options.idlist.list[i].check=true;
								return false;
							}
						}
					}
					options.idlist.list.push({id:row.id, check:true});
					//alert(JSON.stringify(str_temp_2));
				});
				
				// checkbox取消勾选
				$(this).on('uncheck.bs.table', function (event, row) {
					//alert(JSON.stringify(row));
					for(var i=0;i<options.idlist.list.length;++i){
						for (var key in row){
							if(key==options.idlist.key && row[key]==options.idlist.list[i].id){
								options.idlist.list[i].check=false;
								return false;
							}
						}
					};
					options.idlist.list.push({id:row.id, check:false});
				});
				
				// 全部勾选
				$(this).on('check-all.bs.table', function(event, rows){
					for(var j=0;j<rows.length;++j){
						var row = rows[j];
						var flag = false;
						for(var i=0;i<options.idlist.list.length;++i){
							for (var key in row){
								if(key==options.idlist.key && row[key]==options.idlist.list[i].id){
									options.idlist.list[i].check=true;
									flag=true;
									break;
								}
							}
							if(flag)
								break;
						}
						if(!flag)
							options.idlist.list.push({id:row.id, check:true});
					}
				});
				
				// 全部解除勾选
				$(this).on('uncheck-all.bs.table', function(event, rows){
					for(var j=0;j<rows.length;++j){
						var row = rows[j];
						var flag = false;
						for(var i=0;i<options.idlist.list.length;++i){
							for (var key in row){
								if(key==options.idlist.key && row[key]==options.idlist.list[i].id){
									options.idlist.list[i].check=false;
									flag=true;
									break;
								}
							}
							if(flag)
								break;
						};
						if(!flag)
							options.idlist.list.push({id:row.id, check:false});
					}
				});
				
				// 翻页监听器
				if(_options.maintainPage){
					$(this).on('page-change.bs.table', function(event, number, size){
						cPage = number;
					})
				}
				else{
					$(this).on('page-change.bs.table', function(event, number, size){
						return;
					})
					cPage=1;
				}
				
				if(_options.enableSort){
					// 页面读取成功监听器
					$(this).on('load-success.bs.table', function(event, data){
						var head = that.find('thead').first();
						if(that.context._options.orderIndex!=-1){
							var t = head.find('th').eq(that.context._options.orderIndex).children().first();
							var span = head.find("span");
							if(typeof(span)!='undefined' && span.length>0){
								span.remove();
							}
							if(typeof(t)!='undefined'){
								if(that.context._options.orderDirection===0){
									t.append("<span class='glyphicon glyphicon-triangle-bottom' aria-hidden='true'></span>");
								}
								else if(that.context._options.orderDirection===1){
									t.append("<span class='glyphicon glyphicon-triangle-top' aria-hidden='true'></span>");
								}
							}
						}
						
					});
				}
				
				// 按钮
				if(_options.enableButton){
					// 页面读取成功监听器
					$(this).on('post-body.bs.table', function(event){
						var body = that.find('tbody').find('tr');
						// 有数据的时候才添加按钮
						if(body.eq(0).find('td').length>1){
							for(var i=0;i<body.length;++i){
								var td = body.eq(i).find('td').last();
								td.addClass('bs-checkbox');
								td.empty();
								var btn = $("<div><button class='"+_options.buttonClass+"' type='submit'>"+_options.buttonText+"</button></div>");
								btn.click(function(event){
									var data = that.bootstrapTable('getData', true);
									var index = $(this).parent().parent().index();
									that.trigger('bootstrap-custom-table.btn', data[index]);
									return false;
								});
								td.append(btn);
							}
						}
					});
				}
				
			}
			
			if(_options.enableSort){
				// 配置一个head标题栏点击监听器
				$(this).find('thead').click(function(event){
					var tag = event.target.parentElement.cellIndex;
					// 如果点击在<span/>标签上，因为在<div/>内部，所以还要再往上找
					if(typeof(tag)==='undefined')
						tag = event.target.parentElement.parentElement.cellIndex;
					if(typeof(tag)!='undefined'){
						that.trigger('bootstrap-custom-table.sort', tag);
					}
				})
			}
			
			isInit = true;
			
			$(this).context._options=_options;
			$(this).context.cPage=cPage;
			
		},
		"getCustomSelections": function(){
			return $(this).context._options.idlist.list;
		},
		"clearCustomSelections": function(){
			var that = $(this);
			var list = that.context._options.idlist.list;
			for(var i in list){
				list[i].check = false;
			}
		},
		"refreshCustomTable": function(isKeepSelection){
			var that = $(this);
			if(typeof(isKeepSelection)==='undefined' || !isKeepSelection)
				that.context._options.idlist.list=[];
			that.bootstrapTable('selectPage', that.context.cPage);
		},
		"setSortTag": function(index){
			var that = $(this);
			if(index!=-1){
				// 如果前后标签不一样，默认降序排列
				if(that.context._options.orderIndex != index){
					that.context._options.orderDirection=0;
				}
				else{
					switch(that.context._options.orderDirection){
						case -1 : that.context._options.orderDirection=0;break;
						case 0 : that.context._options.orderDirection=1;break;
						case 1 : that.context._options.orderDirection=-1;break;
					}
				}
				that.context._options.orderIndex = index;
			}
			return that.context._options.orderDirection;
		},
		"getSortTag": function(){
			return $(this).context._options.orderDirection;
		}
		
	});
	
	var defaults = {
		url : '',	// 请求的URL地址
		queryParams : function(params){return params},	// 请求附加参数
		columnsData : null,		// 列的名称{"name":"", "hide":false}
		fieldData : null,		// 列对应的域名称
		isMultiSelect : false,
		isClickToSelect : true,
		rowStyle : 
			function (row, index){
				for(var i=0;i<defaults.idlist.list.length;++i){
					if(defaults.idlist.list[i].id==row.id){
						if(defaults.idlist.list[i].check)
							return {checked:true};
						else
							return {};
					}
				};
				// 没有这个设备，先插入
				var obj = {id:row.id, check:false};
				defaults.idlist.list.push(obj);
				if(obj.check)
					return {checked:true};
				else
					return {};
			},
		idlist : {key:'id', list:[]},
		pageNumber : 1,			// 设置当前的页数
		maintainPage : true,	// 自动维护翻页
		checkbox : true,		// 是否显示勾选框
		showRefresh : false,	// 是否显示刷新按钮
		enableSearch : true,	// 是否启用搜索框
		searchText : '搜索',		// 搜索框提示文字
		enableSort : false,		// 是否允许排序
		orderIndex : -1,		// 排序的列编号，从0开始，-1则不添加排序标记
		orderDirection : 0,		// 排序的方向，0为降序，1为升序
		enableButton: false,	// 是否启用按钮
		buttonText: '按钮',		// 按钮文字
		buttonClass: 'btn btn-primary btn-xs'	// 按钮风格
	};
    
})(window.jQuery);
