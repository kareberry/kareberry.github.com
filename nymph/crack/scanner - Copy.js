var crtest = function()
{
	$(document).ready(function()
	{
		for (var theme in allThemes)
		{
			return;
			var boostType = 2;
			if (/^竞技场: /.test(theme))
				boostType = 1;
			var criteria = cr_GetCriteriaByLevel(allThemes[theme]);
			//alert(clothesRanking['发型'][0].totalScore);
			refreshBoost(allThemes[theme]);
			setBoost(allThemes[theme], boostType);
			alert(criteria.boost1);
			alert(criteria.boost2);
			break;
		}
	});
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
		$('#theme option[value="' + theme + '"]').prop('selected', 'selected');
		changeTheme();
		var boostType = 2;
		if (/^竞技场: /.test(theme))
			boostType = 1;
		if (boostType != global.boostType)
			changeBoost(boostType);
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
