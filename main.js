// TODO: add a 'only in israel' message at bottom of page. create footer while at it.
const TIMEZONE = 'Asia%2FJerusalem';
const DEFAULT_LOCATION = {
	lat: 32.083377,
	lng: 34.850648
};

const getPosUrl = (lat, lng) => `geo=pos&latitude=${lat}&longitude=${lng}&tzid=${TIMEZONE}`;

$(document).ready(() => {	
	const defaultPosUrl = getPosUrl(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
	$.get(`https://www.hebcal.com/shabbat/?cfg=json&${defaultPosUrl}&m=40`, (data) => {
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

	const PARASH_ID = "parashat";
	const CANDLES_ID = "candles";
	const HAVDALAH_ID = "havdalah";
	
	const parashValue = items.find((item) => item.category === PARASH_ID);
	// Get shabbat date by parash item
	const shabbatDate = new Date(parashValue.date);
	const parashHolderElm = $(`#${PARASH_ID}`);
	parashHolderElm.attr('href', parashValue.link);
	parashHolderElm.attr('title', 'לפרטים נוספים על הפרשה... (אנגלית)');
	parashHolderElm.text(parashValue.hebrew);

	const shabbatOnlyItems = items.filter((item) => isDateEqualNoTime(new Date(item.date), shabbatDate));
	const fridayOnlyItems = items.filter((item) => isDateEqualNoTime(new Date(item.date), getDayBefore(shabbatDate)));

	console.log('shabbatOnlyItems :', shabbatOnlyItems);
	console.log('fridayOnlyItems :', fridayOnlyItems);

	handleTimeCategory(CANDLES_ID, fridayOnlyItems);
	handleTimeCategory(HAVDALAH_ID, shabbatOnlyItems);
}

const handleTimeCategory = (category, items) => {
	const valueOfCategory = items.find((item) => item.category === category);
	const timeAsText = dateToShortTimeString(new Date(valueOfCategory.date));

	$(`#${category}`).text(timeAsText);	
}

const getDayBefore = (date) => {
	const res = new Date(date);
	res.setDate(res.getDate() - 1);
	return res;
}

const isDateEqualNoTime = (date1, date2) => {
	const date1NoTime = new Date(Date.UTC(date1.getUTCFullYear(), date1.getUTCMonth(), date1.getUTCDate()));
	const date2NoTime = new Date(Date.UTC(date2.getUTCFullYear(), date2.getUTCMonth(), date2.getUTCDate()));
	return (date1NoTime.getTime() === date2NoTime.getTime());
}