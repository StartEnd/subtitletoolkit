export function todayInLocalTimeZone() {
	const now = new Date();
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: 'Asia/Shanghai',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).formatToParts(now);
	const year = parts.find((part) => part.type === 'year')?.value;
	const month = parts.find((part) => part.type === 'month')?.value;
	const day = parts.find((part) => part.type === 'day')?.value;
	return `${year}-${month}-${day}`;
}
