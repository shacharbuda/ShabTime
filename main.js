$(document).ready(() => {	
	$.get('https://www.hebcal.com/shabbat/?cfg=json&geonameid=294981&m=40', (data) => {
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

const dateToShortTimeString = (date) => {
	const settingsForShortTime = {hour: "2-digit", minute: "2-digit"};
	return (date.toLocaleTimeString('he-IL', settingsForShortTime));
}

const writeItems = (items) => {
	const timeCategories = ["candles", "havdalah"];
	
	timeCategories.forEach(category => {
		const valueOfCategory = items.find((item) => item.category === category);
		const timeAsText = dateToShortTimeString(new Date(valueOfCategory.date));

		$(`#${category}`).text(timeAsText);
	})

	const PARASH_ID = "parashat";

	const parashValue = items.find((item) => item.category === PARASH_ID);
	const parashHolderElm = $(`#${PARASH_ID}`);
	parashHolderElm.attr('href', parashValue.link);
	parashHolderElm.attr('title', 'לפרטים נוספים על הפרשה... (אנגלית)');
	parashHolderElm.text(parashValue.hebrew);
}