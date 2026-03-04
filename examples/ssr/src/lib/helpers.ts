import { msg } from 'sveltext';

export function inferPreferredLocale(acceptLanguageHeader: string | null) {
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
