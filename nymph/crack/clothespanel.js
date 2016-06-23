var cr_Wardrobe = [];

var cr_Init = function()
{
	cr_LoadWardrobe();
	$(document).ready(function()
	{
		var dropdown = $("#crCategory")[0];
		for (var i in category)
		{
			var option = document.createElement('option');
			option.text = category[i];
			option.value = category[i];
			dropdown.add(option);
		}
	});
	$(document).ready(function()
	{
		var dropdown = $("#crRarity")[0];
		for (var i = 5; i > 0; i--)
		{
			var option = document.createElement('option');
			option.text = i + '星';
			option.value = i.toString();
			dropdown.add(option);
		}
	});
}();

function cr_GetCookie(c_name)
{
	if (document.cookie.length > 0)
	{
		c_start = document.cookie.indexOf(c_name + "=");
		if (c_start != -1)
		{
			c_start = c_start + c_name.length + 1;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1)
				c_end = document.cookie.length;
			return unescape(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}

function cr_SetCookie(c_name, c_value)
{
	document.cookie = c_name + '=' + c_value;
}

function cr_LoadWardrobe()
{
	//cr_SetCookie('crwardrobe', '调试用1|发型|998|5||SS||SS||SS||SS||SS||赠送|#调试用2|发型|999|5||SS||SS||SS||SS||SS||赠送|');
	var sa = cr_GetCookie('crwardrobe').split('#');
	for (var i in sa)
	{
		var c = sa[i].split('|');
		if (c.length != wardrobe[0].length)
			continue;
		cr_Wardrobe.push(c);
		wardrobe.push(c);
	}
	$(document).ready(function()
	{
		cr_UpdateList();
	});
}

function cr_SaveWardrobe()
{
	var sa = [];
	for (var i in cr_Wardrobe)
		sa.push(cr_Wardrobe[i].join('|'));
	var s = sa.join('#');
	cr_SetCookie('crwardrobe', s);
	return s;
}

function cr_UpdateList()
{
	var s = cr_SaveWardrobe();
	$("#crData").val(s);
	$("#cr_list").empty();
	for (var i in cr_Wardrobe)
	{
		var rarity = "♥♥♥♥♥".substring(5 - parseInt(cr_Wardrobe[i][3]));
		var id = 'No.' + cr_Wardrobe[i][2];
		if (id == "")
			id = "???";
		var tags = cr_Wardrobe[i][14];
		if (tags == "")
			tags = "&nbsp;";
		var r1, r2, r3, r4, r5;
		if (cr_Wardrobe[i][5] == "")
			r1 = "华丽:" + cr_Wardrobe[i][4];
		else
			r1 = "简约:" + cr_Wardrobe[i][5];
		if (cr_Wardrobe[i][10] == "")
			r2 = "清纯:" + cr_Wardrobe[i][11];
		else
			r2 = "性感:" + cr_Wardrobe[i][10];
		if (cr_Wardrobe[i][6] == "")
			r3 = "活泼:" + cr_Wardrobe[i][7];
		else
			r3 = "优雅:" + cr_Wardrobe[i][6];
		if (cr_Wardrobe[i][13] == "")
			r4 = "清凉:" + cr_Wardrobe[i][12];
		else
			r4 = "保暖:" + cr_Wardrobe[i][13];
		if (cr_Wardrobe[i][8] == "")
			r5 = "可爱:" + cr_Wardrobe[i][9];
		else
			r5 = "成熟:" + cr_Wardrobe[i][8];
		var ele = '<div class="cr_listitem"><div class="crli_left"><div class="crli_l1">' + cr_Wardrobe[i][0] + '</div><div class="crli_l2">' + cr_Wardrobe[i][1] + '</div><div class="crli_l3">' + id + '</div><div class="crli_l4">' + rarity + '</div><div class="crli_l5">' + tags + '</div></div><div class="crli_right"><div class="crli_r1">' + r1 + '</div><div class="crli_r2">' + r2 + '</div><div class="crli_r3">' + r3 + '</div><div class="crli_r4">' + r4 + '</div><div class="crli_r5">' + r5 + '</div></div><div class="crli_delete"><button class="btn btn-danger btn-xs crli_btndelete" onclick="cr_RemoveClothes(' + i + ')">X</button></div></div>';
		$("#cr_list").append(ele);
	}
}

function cr_AddClothes()
{
	var name = $('#crName').val();
	if (name == "")
	{
		alert("还没输入衣服名称呢");
		return;
	}
	var category = $('#crCategory').val();
	var id = $('#crId').val();
	var rarity = $('#crRarity').val();
	var ta1 = $('#crTags').val().split(' ');
	var ta2 = [];
	for (var i in ta1)
		if (ta1[i] != "")
			ta2.push(ta1[i]);
	var tags = ta2.join(',');
	var simple = cr_GetAttribute('simple');
	var pure = cr_GetAttribute('pure');
	var active = cr_GetAttribute('active');
	var cool = cr_GetAttribute('cool');
	var cute = cr_GetAttribute('cute');
	var c = [name,
		category,
		id,
		rarity,
		simple[1],
		simple[0],
		active[1],
		active[0],
		cute[1],
		cute[0],
		pure[1],
		pure[0],
		cool[0],
		cool[1],
		tags,
		'',
		''];
	cr_Wardrobe.push(c);
	cr_UpdateList();
}

function cr_GetAttribute(attr)
{
	var radio = $('input[name=cr_' + attr + ']:checked');
	if (radio.length)
	{
		if (radio.hasClass('attr-negative'))
			return ['',radio.val()];
		else
			return [radio.val(),''];
	}
	return ['',''];
}

function cr_RemoveClothes(index)
{
	if (!confirm('确定要删除这件衣服吗？'))
		return;
	cr_Wardrobe.splice(index, 1);
	cr_UpdateList();
}

function cr_Reset()
{
	$('#crName').val('');
	$('#crCategory option:first').prop('selected', 'selected');
	$('#crId').val('');
	$('#crRarity option:first').prop('selected', 'selected');
	$('#crTags').val('');
	$('input.cr-attr-radio').removeAttr('checked');
	$('input.cr-attr-radio').parent('label').removeClass('active');
}

function cr_SetData()
{
	cr_Wardrobe = [];
	var sa = $("#crData").val().split('#');
	for (var i in sa)
	{
		var c = sa[i].split('|');
		if (c.length != wardrobe[0].length)
			continue;
		cr_Wardrobe.push(c);
	}
	cr_UpdateList();
}