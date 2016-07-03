function GetUrlParam(name)
{
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
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
		if (array[i] != value)
			newArray.push(array[i]);
	return newArray;
}

function RoundEx(num, digits)
{
	return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
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