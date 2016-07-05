var cr_synclock = false;

function cr_Scan()
{
	if (cr_synclock)
		return;
	cr_synclock = true;
	var rankinglength = parseInt($('#cr_scanrankinglength').val());
	if (isNaN(rankinglength))
		rankinglength = 5;
	var targettmp = {};
	var target = [];
	for (var i in cr_Wardrobe)
		targettmp[cr_Wardrobe[i][0][0]] = cr_Wardrobe[i][0][1];
	for (var cate in clothesSet)
		for (var id in clothesSet[cate])
			if (clothesSet[cate][id].own)
				targettmp[clothesSet[cate][id].name] = clothesSet[cate][id].type.type;
	for (var name in targettmp)
		target.push({
			Name : name,
			Category : targettmp[name],
		});
	var result = [];
	for (var i in target)
		result[i] = [];
	var themeNames = [];
	for (var theme in allThemes)
		themeNames.push(theme);
	var si = 0;
	var title = $(document).attr("title");
	var btntext = $('#cr_btnscan').html();
	var func = function()
	{
		while (si < themeNames.length)
		{
			var theme = themeNames[si];
			var boostType = 2;
			if (/^竞技场: /.test(theme))
				boostType = 1;
			var criteria = cr_GetCriteriaByLevel(allThemes[theme]);
			refreshBoost(criteria);
			global.boostType = boostType;
			switch(boostType)
			{
				case 2: // global
					criteria.boost1 = global.extreme.boost1;
					criteria.boost2 = global.extreme.boost2;
					shoppingCart.clear();
					if (global.extreme.shoppingCart) {
						for (var i in global.extreme.shoppingCart.cart) {
							shoppingCart.put(global.extreme.shoppingCart.cart[i][2]);
						}
					}
					break;
				case 3: // own
					criteria.boost1 = global.extremeOwn.boost1;
					criteria.boost2 = global.extremeOwn.boost2;
					shoppingCart.clear();
					if (global.extremeOwn.shoppingCart) {
						for (var i in global.extremeOwn.shoppingCart.cart) {
							shoppingCart.put(global.extremeOwn.shoppingCart.cart[i][2]);
						}
					}
					break;
				default:
					criteria.boost1 = null;
					criteria.boost2 = null;
					break;
			}
			calcClothes(criteria);
			for (var i in target)
			{
				var cate = target[i].Category;
				for (var j = 0; j < rankinglength && j < clothesRanking[cate].length; j++)
				{
					var list = [];
					for (var k = 0; k < rankinglength && k < clothesRanking[cate].length; k++)
						list.push(clothesRanking[cate][k].name + '(' + clothesRanking[cate][k].totalScore + ')');
					if (clothesRanking[cate][j].name == target[i].Name)
						result[i].push({
							Theme : theme,
							Rank : j,
							List : list,
						});
				}
			}
			var percentage = Math.floor(si / themeNames.length * 100) + '%';
			$('#cr_btnscan').html(percentage); 
			$(document).attr("title", '【' + percentage + '】' + title);
			si++;
			if (si < themeNames.length)
			{
				setTimeout(func, 1);
				return;
			}
		}
		$('#cr_btnscan').html(btntext);
		$(document).attr("title", title);
		$('#cr_scanresult').show();
		$('#cr_scanresult').html('');
		for (var i in target)
		{
			if (i > 0)
				$('#cr_scanresult').append('<hr/>');
			$('#cr_scanresult').append('<div class="cr_result_name">' + target[i].Name + '</div>');
			$('#cr_scanresult').append('<div class="cr_result_cate">' + target[i].Category + '</div>');
			$('#cr_scanresult').append('<div class="cr_result_count">(共' + result[i].length + '关)</div>');
			result[i].sort(function(a, b)
			{
				var n = a.Rank - b.Rank;
				if (n != 0)
					return n;
				return (a.Theme > b.Theme) ? 1 : ((a.Theme < b.Theme) ? -1 : 0);
			});
			for (var j in result[i])
			{
				var list = [];
				for (var k in result[i][j].List)
				{
					var str = result[i][j].List[k];
					if (k == result[i][j].Rank)
						list.push('<span class="cr_result_highlight"> ' + str + '</span>');
					else
						list.push(str);
				}
				var html = '<div class="cr_result_item"><div class="cr_result_level">' + result[i][j].Theme + '&nbsp;第' + (result[i][j].Rank + 1) + '名</div><div class="cr_result_list">' + list.join('&nbsp;>&nbsp;') + '</div></div>';
				$('#cr_scanresult').append(html);
			}
		}
		cr_synclock = false;
	};
	func();
}

function cr_GetCriteriaByLevel(level)
{
	var criteria = {};
	for (var f in level.weight)
		criteria[f] = level.weight[f];
	criteria.bonus = [];
	for (var i in level.bonus)
		criteria.bonus.push(addScoreBonusFactory(level.bonus[i].base, level.bonus[i].weight, level.bonus[i].tag)(criteria));
	return criteria;
}
