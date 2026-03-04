import type { Handle } from '@sveltejs/kit';
import { inferPreferredLocale } from '$lib/helpers';

export const handle: Handle = async ({ event, resolve }) => {
	let currentLocale = event.cookies.get('currentLocale');

	if (!currentLocale) {
		currentLocale = inferPreferredLocale(event.request.headers.get('accept-language'));
	}

	event.locals.currentLocale = currentLocale;
	event.cookies.set('currentLocale', currentLocale, {
		path: '/',
		httpOnly: false,
		secure: false
	});

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', currentLocale)
	});

	return response;
};
