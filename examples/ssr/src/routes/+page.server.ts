import type { Actions } from './$types';

export const actions = {
	setLocale: async (event) => {
		const formData = await event.request.formData();
		const nextLocale = formData.get('locale');
		if (typeof nextLocale === 'string') {
			event.cookies.set('currentLocale', nextLocale, { path: '/', httpOnly: false, secure: false });
		}
	}
} satisfies Actions;
