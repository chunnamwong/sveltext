import type { LayoutLoad } from './$types';
import { getCurrentLocale } from '$lib/i18n';

export const ssr = false;

export const load: LayoutLoad = async () => {
	const currentLocale = getCurrentLocale();
	const { messages } = await import(`../locales/${currentLocale}.po`);

	return {
		currentLocale,
		messages
	};
};
