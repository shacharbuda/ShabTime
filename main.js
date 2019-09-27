$(document).ready(() => {
	console.log("here");
	$.get('https://www.hebcal.com/shabbat/?cfg=json&geonameid=294981&m=18', (data) => {
		const items = data.items;
		writeItems(items);
	});
});

const writeItems = (items) => {
	const categories = ["candles", "havdalah"];
	categories.forEach(category => {
		const valueOfCategory = items.find((item) => item.category === category);
		const timeAsText = new Date(valueOfCategory.date).toLocaleTimeString();
		const timeWithoutSeconds = timeAsText.split(':').slice(0, 2).join(':');

		$(`#${category}`).text(timeWithoutSeconds);
	})

	const PARASH_ID = "parashat";

	const parashValue = items.find((item) => item.category === PARASH_ID);
	$(`#${PARASH_ID}`).text(parashValue.hebrew);
}