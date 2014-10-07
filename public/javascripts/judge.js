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
		var data = {
				cId: $('#cId').val(),
				entries: entries
			};
		$.ajax({
			"url": '/judge/contest/getNewEntry',
			"method": 'post',
			"data": {jsonData : JSON.stringify(data)},
			"datatype": 'json'
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
			updateRatingOnButtons();
		};
		var found = false;

		// traverse the carousel and find the first one in the middle
		$('div#carousel tr').children().each(function() {
			var lPos = $(this).position().left;
			if (isCentered(lPos) && !found) {
				found = true;
				if ($(this).attr('id') != activeId || activeId < 2) {
					activeId = $(this).attr('id');
					engageEntry($(this));
					if (4 > entries.length - activeId) {
						console.log(activeId + " out of " + entries.length);
						addEntryToCarousel();
					}
				}
			} else {
				$(this).children("div.imageFrame").css('background-color', '#000');
			}
		});
	};

	//var changeCenterImageData = function() {};

	var updateRatingOnButtons = function() {
		$('div.button').removeClass('active');
		$('div#button' + entries[activeId].rating).addClass('active');
	};

	var slideLeft = function() {};


	//event handlers
	$('div#carousel').scroll(function() {
		findCenterImage();
	});

	$('div.button').click(function() {
		var rating = $(this).attr('id').substr(6);
		//console.log(rating);
		// update rating locally, then ajax it.
		entries[activeId].rating = rating;
		console.log(entries);
		$.ajax({
			url: '/judge/contest/submitRating',
			method: 'post',
			data: {
				rating: rating,
				cId: $('#cId').val(),
				eId: entries[activeId].eId
			}
		}).done(function(rating) {
			updateRatingOnButtons();
		});
	});

	//actions to execute on page load
	addEntryToCarousel();
};
