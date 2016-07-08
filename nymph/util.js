function GetUrlParam(name)
{
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

function SaveData(key, value)
{
	localStorage.setItem(key, value);
}

function LoadData(key)
{
	return localStorage.getItem(key);
}

function TrimRepeatEx(array, func)
{
	var hash = {};
	var ra = [];
	for (var i in array)
	{
		var key = func(array[i]);
		if (hash[key])
			continue;
		hash[key] = true;
		ra.push(array[i]);
	}
	return ra;
}

function TrimRepeat(array)
{
	return TrimRepeatEx(array, function(o) { return o; });
}

function Trim(array, value)
{
	var newArray = [];
	for (var i = 0; i < array.length; ++i)
		if (!ValueEqualsEx(array[i], value))
			newArray.push(array[i]);
	return newArray;
}

function ValueEqualsEx(value1, value2)
{
	return value1 == value2 || (isNaN(value1) && isNaN(value2));
}

function RoundEx(value, digits)
{
	return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
}

function Contains(array, value)
{
	var i = array.length;
	while (i--) {
		if (array[i] === value) {
			return true;
		}
	}
	return false;
}

function Find(array, value)
{
	for (var i = 0; i < array.length; ++i)
		if (ValueEqualsEx(array[i], value))
			return i;
	return -1;
}

function Replace(array, valueOld, valueNew)
{
	for (var i = 0; i < array.length; ++i)
		if (ValueEqualsEx(array[i], valueOld))
			array[i] = valueNew;
	return array;
}

function MakeUnselectable(ele, cursor)
{
	ele = GetJQueryObject(ele);
	ele.attr('onselectstart', 'return false');
	ele.css('-moz-user-select', 'none');
	if (cursor)
		ele.css('cursor', cursor);
	else if (ele.css('cursor') == 'auto')
		ele.css('cursor', 'default');
}

function GetJQueryObject(value)
{
	if (typeof('') == "string")
		return $(value);
	return value;
}
