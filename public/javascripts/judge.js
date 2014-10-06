var judge = function() {
	console.log("new shit");
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion); 
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Chrome, the true version is after "Chrome" 
	if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
		browserName = "Chrome";
		fullVersion = nAgt.substring(verOffset+7);
		$("div#carousel div.imageFrame").css('-webkit-transform', 'rotate(90deg)');
	}
	$('div#carousel').scroll(function() {
		var active = false;
		var activeId = 0;
		$('div#carousel tr').children().each(function() {
			var lPos = $(this).position().left;
			if (lPos > 250 && !active) {
				$(this).children("div.imageFrame").css('background-color', '#F00');
				active = true;
				activeId = $(this).attr('id');
			} else {
				$(this).children("div.imageFrame").css('background-color', '#000');
			}
			$('p#position').html(activeId);
		});
	});
};
