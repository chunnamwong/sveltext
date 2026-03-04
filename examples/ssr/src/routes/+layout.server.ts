import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const currentLocale = locals.currentLocale;
	const { messages } = await import(`../locales/${currentLocale}.po`);
	return {
		currentLocale,
		messages
	};
};
