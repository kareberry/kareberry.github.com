function cr_Scan()
{
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
	var limit = 9999;
	for (var theme in allThemes)
	{
		--limit;
		if (limit <= 0)
			break;
		var boostType = 2;
		if (/^竞技场: /.test(theme))
			boostType = 1;
		var criteria = cr_GetCriteriaByLevel(allThemes[theme]);
		refreshBoost(criteria);
		setBoost(criteria, boostType);
		calcClothes(criteria);
		for (var i in target)
		{
			var cate = target[i].Category;
			for (var j = 0; j < 5 && j < clothesRanking[cate].length; j++)
			{
				var list = [];
				for (var k = 0; k < 5 && k < clothesRanking[cate].length; k++)
					list.push(clothesRanking[cate][k].name + '(' + clothesRanking[cate][k].totalScore + ')');
				if (clothesRanking[cate][j].name == target[i].Name)
					result[i].push({
						Theme : theme,
						Rank : j,
						List : list,
					});
			}
		}
	}
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
