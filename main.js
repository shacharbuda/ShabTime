let CURRENT_LOCATION = '294981';

$(document).ready(() => {	
	alert("ready")
	navigator.geolocation.getCurrentPosition((position) => {

		let lat, lng;
		const {coords} = position;
		lat = coords.latitude;
		lng = coords.longitude;

		alert('lat :' + lat);
		console.log('lng :', lng);
		$.get(`http://api.geonames.org/findNearbyPlaceName?lat=${lat}&lng=${lng}&username=shacharbuda`, (xmlData) => {
			console.log('data :', xmlData);
			const text = new XMLSerializer().serializeToString(xmlData.documentElement);
			$(".container").text(text);
		})
	}, (error) => alert, {enableHighAccuracy: true, timeout: 3 * 1000});

	
	$.get(`https://www.hebcal.com/shabbat/?cfg=json&geonameid=${CURRENT_LOCATION}&m=18`, (data) => {
		handleDataArrived(data);
	}).fail(() => {
		alert("שגיאה");
	});
});

const handleDataArrived = (data) => {
	$(".spinner-container").fadeOut();
	$(".container").fadeIn();

	const items = data.items;
	writeItems(items);
}

const writeItems = (items) => {
	const timeCategories = ["candles", "havdalah"];
	
	timeCategories.forEach(category => {
		const valueOfCategory = items.find((item) => item.category === category);
		const timeAsText = new Date(valueOfCategory.date).toLocaleTimeString();
		const timeWithoutSeconds = timeAsText.split(':').slice(0, 2).join(':');

		$(`#${category}`).text(timeWithoutSeconds);
	})

	const PARASH_ID = "parashat";

	const parashValue = items.find((item) => item.category === PARASH_ID);
	$(`#${PARASH_ID}`).text(parashValue.hebrew);
}