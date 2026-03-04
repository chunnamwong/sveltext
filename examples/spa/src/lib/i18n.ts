export async function setCurrentLocale(locale: string) {
	localStorage.setItem('currentLocale', locale);
}

const supportedLocales = ['en', 'ja'];

export function getCurrentLocale() {
	const localStorageLocale = localStorage.getItem('currentLocale');

	if (localStorageLocale) {
		return localStorageLocale;
	}

	const preferredLocale = navigator.languages.find((language) =>
		supportedLocales.includes(language)
	);

	if (preferredLocale) {
		return preferredLocale;
	}

	return 'en';
}
