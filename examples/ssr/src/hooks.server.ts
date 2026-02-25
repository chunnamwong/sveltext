import type { Handle } from '@sveltejs/kit';
import { setCurrentLocale, inferPreferredLanguage } from '$lib/helpers';

export const handle: Handle = async ({ event, resolve }) => {
	let currentLocale = event.cookies.get('currentLocale');

	if (!currentLocale) {
		const acceptLanguageHeader = event.request.headers.get('accept-language');
		currentLocale = inferPreferredLanguage(acceptLanguageHeader);
	}

	event.locals.currentLocale = currentLocale;
	event.cookies.set('currentLocale', currentLocale, { path: '/', httpOnly: false, secure: false });
	setCurrentLocale(currentLocale);

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', currentLocale)
	});

	return response;
};
