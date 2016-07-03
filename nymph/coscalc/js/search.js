function cr_Search()
{
	$('#crSearchResult').html('');
	var str = $('#crSearchText').val();
	if (str == '')
		return;
	for (var cate in clothesSet)
		for (var id in clothesSet[cate])
		{
			var name = clothesSet[cate][id].name;
			if (name.indexOf(str) == -1)
				continue;
			var cls = 'clickable-' + cate + id;
			cls += clothesSet[cate][id].own ? ' own' : '';
			var display = name + ' (' + cate + ')';
			var html = '<div class="' + cls + '"><a href="javascript:void(0)" class="button" onClick="toggleInventory(\'' + cate + '\',\'' + id + '\')">' + display + '</a>';
			$('#crSearchResult').append(html);
		}
}
function cr_SearchKeyPress(e)
{
	var keynum;
	if(window.event)
		keynum = e.keyCode;
	else if(e.which)
		keynum = e.which;
	if (keynum == 13)
		cr_Search();
}