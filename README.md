## EasyBootstrapTable

[BoostrapTable](http://bootstrap-table.wenzhixin.net.cn) is a fantastic way to build a customized table while using Boostrap.
But in the use of the process I also found some problems such as in my Firefox browser, BootstrapTable can not be saved in the page when I check the options, table parameters tedious and other issues.
So, I have a simple package for BootstrapTable, and now it can be used normally on my FireFox browser.
The following requirements were pruduced during the process of development, so I also package them through jQuery and make them easy to be used:

1. Table sorting;
2. A button in the last position of the line which can emit an event;
3. Maintain the page after the table reinitialization.

### How to use
Import the scripts of jQuery, Bootstrap, BootstrapTable and EasyBootstrapTable
```markdown
such like the following:
<script src="plugins/jquery/jquery-1.11.3.min.js"></script>
<script src="plugins/bootstrap/bootstrap.min.js"></script>
<script src="plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="plugins/bootstrap-easy-table/bootstrap-easy-table.min.js"></script>
```
The resource files should be imported as well.

Define a table
```markdown
<table id="easy-table" class="table table-striped"></table>
```

Now you can initialize a table like this
```markdown
$('#easy-table').bootstrapCustomTable({
	url: 'node/data_queryBatch.action',
	columnsData: [{name:'ID', hide:true},{name:'name'},{name:'note'},{name:'date'},{name:'button'}],
	fieldData: ['id','name','note','date','button'],
	isMultiSelect: true,
	isClickToSelect: false,
	maintainPage: false,
	enableSearch: false,
	enableButton: true,
	buttonText: 'batch',
	checkbox: false,
	queryParams : 
		function(params){
			params.accessory=$('#accessory-input').val();
			return params
		}
});
```

### Options
1. url
Define thr data request interface. 
```markdown
The format of response data should be like this "{total:100, rows:[{id:1,data:a},{id:2,data:b}]}"
```

2. queryParams[optional]
Request parameters, equal the 'queryParams' in BootstrapTable

3. columnsData
These stings will be showed as the title of columns.
If you do not want make a title invisible but you determine to get the data while user click this row, just set the parameter 'hide' to true.
This will be useful when you use the 'ID' column to locate the selections.
```markdown
[{name:'ID', hide:true},{name:'name'},{name:'note'},{name:'date'},{name:'button'}]
```

4. fieldData


