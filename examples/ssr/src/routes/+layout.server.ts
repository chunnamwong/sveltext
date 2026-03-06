import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const currentLocale = locals.currentLocale;
	return {
		currentLocale
	};
};
