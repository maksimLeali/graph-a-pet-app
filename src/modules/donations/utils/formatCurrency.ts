export const formatCents = (
	cents: number,
	currency = "usd",
	locale = "it"
): string =>
	new Intl.NumberFormat(locale, { style: "currency", currency }).format(
		cents / 100
	);
