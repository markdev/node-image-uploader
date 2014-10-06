var judge = function() {
	console.log("new shit");
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion); 
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;
	var activeId = 0;

	// In Chrome, the true version is after "Chrome" 
	if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
		browserName = "Chrome";
		fullVersion = nAgt.substring(verOffset+7);
		$("div#carousel div.imageFrame").css('-webkit-transform', 'rotate(90deg)');
	}

	$('div#carousel').scroll(function() {
		var active = false;

		var engageEntry = function (element) {
			element.children("div.imageFrame").css('background-color', '#F00');
			var newActiveId = element.attr('id');
			if (newActiveId != activeId) {
				activeId = newActiveId;
				var cId = $('#cId').val(); 
				$.ajax({
					url: '/judge/ajax',
					method: 'post',
					data: {
						'activeId' : activeId,
						'cId' : cId
					}
				}).done(function(data){
					if (data.length > 0) {
						// reset all buttons
					} else {
						// set button
					}
				});
			}
		};

		$('div#carousel tr').children().each(function() {
			var lPos = $(this).position().left;
			if (lPos > 250 && !active) {
				active = true;
				//activeId = $(this).attr('id');
				engageEntry($(this));
			} else {
				$(this).children("div.imageFrame").css('background-color', '#000');
			}
			$('p#position').html(activeId);
		});
	});
};
