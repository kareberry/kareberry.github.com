var log_init = function()
{
	$(document).ready(function()
	{
		var logs = $('.log');
		for (var i = 0; i < logs.length; ++i)
		{
			var div = logs.eq(i);
			var divbox = $('<div class="logbox" folded=1></div>');
			var lines = log_fixtext(div.html());
			var str = lines.join('<br/>');
			str += '<br/><br/><span class="lognotice">收起更新日志</span>';
			divbox.attr('fulltext', str);
			var trun = '<span class="loglastupdate">最后更新: ' + lines[0] + '</span>';
			trun += '<br/><br/>' + 'By 果子';
			trun += '<br/><span class="lognotice">查看全部更新日志</span>';
			divbox.attr('truncatedtext', trun);
			divbox.html(trun);
			div.html(divbox);
			divbox.click(function()
			{
				log = $(this);
				if (log.attr('folded') == 1)
				{
					// unfold
					log.html(log.attr('fulltext'));
					log.attr('folded', 0);
				}
				else
				{
					// fold
					log.html(log.attr('truncatedtext'));
					log.attr('folded', 1);
				}
			});
		}
	});
}();

function log_fixtext(str)
{
	if (!str)
		return '';
	var lines = str.split('\n');
	var si, ei;
	for (si = 0; si < lines.length && /^\s*$/.test(lines[si]); si++)
		;
	for (ei = lines.length - 1; ei >= 0 && /^\s*$/.test(lines[ei]); ei--)
		;
	lines = lines.slice(si, ei + 1);
	var tabs = Number.MAX_VALUE;
	for (var i in lines)
	{
		var index = str.search(/[^\t]|$/);
		if (index < tabs)
			tabs = index;
	}
	if (tabs >= 0)
		for (var i in lines)
			lines[i] = lines[i].substr(tabs + 1);
	return lines;
}