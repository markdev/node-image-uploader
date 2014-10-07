var judge = function() {
	//This corrects that stupid browser rotation thing in Chrome
	var browserAdjust = function() {
		var nVer = navigator.appVersion;
		var nAgt = navigator.userAgent;
		var browserName  = navigator.appName;
		var fullVersion  = ''+parseFloat(navigator.appVersion); 
		var majorVersion = parseInt(navigator.appVersion,10);
		var nameOffset,verOffset,ix;
		if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
			browserName = "Chrome";
			fullVersion = nAgt.substring(verOffset+7);
			$("div#carousel div.imageFrame").css('-webkit-transform', 'rotate(90deg)');
		}
	};

	//variables
	// entries will be an array of JSON objects that looks roughly like this:
	// {
	//		eId: int,
	//		src: string,
	//		rating: int
	// }
	var entries = [];

	// this specifies the index of the entries for the active entry
	// this will be an int, and will reference the html element ids
	var activeId = 0;

	//internal functions
	var addEntryToCarousel = function() {
		$.ajax({
			url: '/judge/contest/getNewEntry',
			method: 'post',
			data: {
				cId: $('#cId').val(),
				entries: entries
			}
		}).done(function(rows) {
			// Add the entry to the carousel
			$('div#carousel table tr').append('<td id="' + entries.length + '"><div class="imageFrame"><img src="/entries/' + rows[0].picture + '" /></div></td>');
			browserAdjust();
			// Now add the data to entries[]
			entries[entries.length] = {
				eId: rows[0].id,
				src: rows[0].picture,
				rating: false
			};
			findCenterImage();
		});
	};

	var findCenterImage = function() {
		var isCentered = function(pos) { return (pos > 250)? true : false; };
		var engageEntry = function(element) { 
			element.children("div.imageFrame").css('background-color', '#F00'); 
		};
		var found = false;

		// traverse the carousel and find the first one in the middle
		$('div#carousel tr').children().each(function() {
			var lPos = $(this).position().left;
			if (isCentered(lPos) && !found) {
				found = true;
				if ($(this).attr('id') != activeId || activeId < 4) {
					activeId = $(this).attr('id');
					engageEntry($(this));
					if (4 > entries.length - activeId) {
						console.log(entries.length);
						addEntryToCarousel();
					}
				}
			} else {
				$(this).children("div.imageFrame").css('background-color', '#000');
			}
			// now look at entries and see how many come after activeId
		});
	};

	var changeCenterImageData = function() {};

	var updateRatingOnButtons = function() {};

	var slideLeft = function() {};


	//event handlers
	$('div#carousel').scroll(function() {
		findCenterImage();
	});

	$('div.button').click(function() {});

	//actions to execute on page load
	addEntryToCarousel();


/*
	var activeId = 1;

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
					$('div.button').removeClass('active');
					if (typeof data[0] == "object") {
						var rating = data[0].rating;
						$('div#button' + rating).addClass('active');
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

	$('div.button').click(function(){
		var rating = $(this).attr('id').substr(6);
		//console.log(rating);
		$.ajax({
			url: '/judge/rateEntry',
			method: 'post',
			data: {
				rating: rating,
				cId: $('#cId').val(),
				eId: activeId
			}
		}).done(function(rating) {
			//console.log(data);
			$('div.button').removeClass('active');
			$('div#button' + rating).addClass('active');
		});
	});
*/
};
