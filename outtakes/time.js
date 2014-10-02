var minutes = ['00', '15', '30', '45'];
for (var hour = 0; hour < 24; hour++) {
	for (var i in minutes) {
		var time = String(hour) + ':' + minutes[i];
		console.log('option(value="' + time + '") ' + time);
	}
}
