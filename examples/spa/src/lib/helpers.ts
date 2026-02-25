import { browser } from '$app/environment';
import { state } from '$lib/state.svelte.js';
import { msg, setLocale } from 'sveltext';

export async function setCurrentLocale(nextLocale: string) {
	const { messages } = await import(`../locales/${nextLocale}.po`);
	setLocale(nextLocale, messages);
	state.currentLocale = nextLocale;
	if (browser) {
		document.querySelector('html')!.setAttribute('lang', nextLocale);
		localStorage.setItem('currentLocale', nextLocale);
	}
}

const supportedLanguages = ['en', 'ja'];

export function inferPreferredLanguage() {
	const localStorageLocale = localStorage.getItem('currentLocale');

	if (localStorageLocale) {
		return localStorageLocale;
	}

	const preferredLanguage = navigator.languages.find((language) =>
		supportedLanguages.includes(language)
	);

	if (preferredLanguage) {
		return preferredLanguage;
	}

	return 'en';
}

export const errors = {
	sync: msg`Error while syncing items`
};
