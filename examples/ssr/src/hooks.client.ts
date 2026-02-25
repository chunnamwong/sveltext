import { setCurrentLocale } from '$lib/helpers';

const currentLocale =
	document.cookie
		.split('; ')
		.find((row) => row.startsWith('currentLocale='))
		?.split('=')[1] ?? 'en';

await setCurrentLocale(currentLocale);
