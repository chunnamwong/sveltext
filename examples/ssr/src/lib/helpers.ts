import { msg } from 'sveltext';
import { browser } from '$app/environment';
import { setLocale } from 'sveltext';

export async function setCurrentLocale(nextLocale: string) {
	const { messages } = await import(`../locales/${nextLocale}.po`);
	setLocale(nextLocale, messages);
	if (browser) {
		document.querySelector('html')!.setAttribute('lang', nextLocale);
	}
}

export function inferPreferredLanguage(acceptLanguageHeader: string | null) {
	if (acceptLanguageHeader) {
		if (acceptLanguageHeader.startsWith('en')) {
			return 'en';
		}

		if (acceptLanguageHeader.startsWith('ja')) {
			return 'ja';
		}
	}

	return 'en';
}

export const errors = {
	sync: msg`Error while syncing items`
};
