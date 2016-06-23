var crtest = function()
{
}();

function cr_Scan()
{
	var result = [];
	for (var i in cr_Wardrobe)
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
		for (var i in cr_Wardrobe)
		{
			var cate = cr_Wardrobe[i][1];
			for (var j = 0; j < 5 && j < clothesRanking[cate].length; j++)
			{
				if (clothesRanking[cate][j].name == cr_Wardrobe[i][0])
					result[i].push([theme, j]);
			}
		}
	}
	$('#cr_scanresult').html('');
	for (var i in cr_Wardrobe)
	{
		if (i > 0)
			$('#cr_scanresult').append('<hr/>');
		$('#cr_scanresult').append('<div class="cr_result_name">' + cr_Wardrobe[i][0] + '</div>');
		$('#cr_scanresult').append('<div class="cr_result_cate">' + cr_Wardrobe[i][1] + '</div>');
		$('#cr_scanresult').append('<div class="cr_result_count">(共' + result[i].length + '关)</div>');
		for (var j in result[i])
			$('#cr_scanresult').append('<div class="cr_result_item">' + result[i][j][0] + '&nbsp;-&nbsp;' + (result[i][j][1] + 1) + '</div>');
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
