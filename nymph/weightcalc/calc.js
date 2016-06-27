var law_AttributeName = ['简约','华丽','清纯','性感','活泼','优雅','清凉','保暖','可爱','成熟'];
var law_ClothesScore = [65, 174, 53, 173, 53, 267, 319, 57, 52, 316];
var law_IPFactor = 1/15;
var law_IPTrans = [[0, 1], [8, 9], [4, 5], [2, 3], [6, 7]];
var law_IPWeight = [];

var law_init = function()
{
	$(document).ready(function()
	{
		law_inittable();
		law_calc(-1);
		law_addrow(5);
	});
}();

function law_calcattr(index)
{
	var rows = $('.law_col_data');
	var vals = [];
	for (var i = 0; i < rows.length; ++i)
	{
		var val = parseInt(rows.eq(i).find('input').eq(index).val());
		if (!isNaN(val))
		{
			vals.push(val);
			if (i == rows.length - 1)
				law_addrow(1);
		}
	}
	var solutions = [];
	if ($('#law_col_force input').eq(index).prop('checked') && vals.length >= 1)
	{
		solutions.push(vals[0]);
	}
	else
	{
		var candidates = {};
		if (vals.length > 1)
		{
			candidates[vals[0]] = true;
			candidates[Math.ceil((vals[0] - 0.5) / 0.99)] = true;
			candidates[Math.floor((vals[0] + 0.5) / 0.99)] = true;
			candidates[Math.floor((vals[0] + 0.5) / 1.01)] = true;
		}
		for (var c in candidates)
		{
			var found = true;
			for (var k in vals)
			{
				if (vals[k] == c || vals[k] == Math.round(c * 0.99) || vals[k] == Math.round(c * 1.01))
					continue;
				found = false;
				break;
			}
			if (found)
				solutions.push(c);
		}
	}
	if (solutions.length == 1)
	{
		var basescore = solutions[0];
		var weight = basescore / law_ClothesScore[index];
		var ipweight = weight * law_IPFactor;
		$('#law_col_basescore .law_cell').eq(index + 1).html(basescore);
		$('#law_col_weight .law_cell').eq(index + 1).html(law_round(weight, 2));
		$('#law_col_ipweight .law_cell').eq(index + 1).html(law_round(ipweight, 2));
		law_IPWeight[index] = ipweight;
	}
	else
	{
		$('#law_col_basescore .law_cell').eq(index + 1).html('&nbsp');
		$('#law_col_weight .law_cell').eq(index + 1).html('&nbsp');
		$('#law_col_ipweight .law_cell').eq(index + 1).html('&nbsp');
		law_IPWeight[index] = Math.NaN;
	}
}

function law_calc(col)
{
	if (col >= 0)
		law_calcattr(col);
	else if (col == -1)
		for	(var i = 0; i < law_AttributeName.length; ++i)
		law_calcattr(i);
	var ips = '<span style="color:#AAA">此处显示脚本代码<span>';
	var s = [];
	for (var i in law_IPTrans)
	{
		var s1 = law_IPWeight[law_IPTrans[i][0]];
		var s2 = law_IPWeight[law_IPTrans[i][1]];
		if (s1 && !s2)
			s.push(law_round(s1, 2));
		else if (!s1 && s2)
			s.push(law_round(-s2, 2));
		else
		{
			s = [];
			break;
		}
	}
	if (s.length)
		ips = '[' + s.join(', ') + ']';
	$('#law_ipscript').html(ips);
}

function law_round(num, digits)
{
	return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
}

function law_celltemplate(innerhtml)
{
	if (!innerhtml)
		innerhtml = '';
	return '<div class="law_cell">' + innerhtml + '</div>';
}

function law_rowtemplate(id, classname, innerhtml)
{
	if (id && id.length)
		id = ' id="' + id + '"';
	else
		id = '';
	if (classname && classname.length)
		classname = ' class="' + classname + ' law_row"';
	else
		classname = ' class="law_row"';
	return '<div' + id + classname + '>' + innerhtml + '</div>';
}

function law_inittable()
{
	var row;
	row = law_celltemplate('&nbsp;');
	for	(var i in law_AttributeName)
		row += law_celltemplate(law_AttributeName[i]);
	row	= law_rowtemplate('law_col_header', null, row);
	$('#law_table').append(row);
	row = law_celltemplate('基础分');
	for	(var i in law_AttributeName)
		row += law_celltemplate(null);
	row	= law_rowtemplate('law_col_basescore', null, row);
	$('#law_table').append(row);
	row = law_celltemplate('权重');
	for	(var i in law_AttributeName)
		row += law_celltemplate(null);
	row	= law_rowtemplate('law_col_weight', null, row);
	$('#law_table').append(row);
	row = law_celltemplate('IP权重');
	for	(var i in law_AttributeName)
		row += law_celltemplate(null);
	row	= law_rowtemplate('law_col_ipweight', null, row);
	$('#law_table').append(row);
	row = law_celltemplate('强制');
	for	(var i in law_AttributeName)
		row += law_celltemplate('<input type="checkbox" onClick="law_calc(' + i + ')" />');
	row	= law_rowtemplate('law_col_force', null, row);
	$('#law_table').append(row);
}

function law_addrow(count)
{
	var row = law_celltemplate('输入得分');
	for	(var i = 0; i < law_AttributeName.length; ++i)
		row += law_celltemplate('<div class="law_inputbox"><input type="text" onInput="law_calc(' + i + ')"/></div>');
	row = law_rowtemplate(null, 'law_col_data', row);
	for	(var i = 0; i < count; ++i)
		$('#law_table').append(row);
}