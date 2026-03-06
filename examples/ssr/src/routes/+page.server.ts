import { msg, _ } from 'sveltext';
import type { Actions } from './$types';
import { loadMessageCatalog } from '$lib/i18n';

export const actions = {
	setLocale: async (event) => {
		const formData = await event.request.formData();
		const nextLocale = formData.get('locale');
		if (typeof nextLocale === 'string') {
			event.cookies.set('currentLocale', nextLocale, { path: '/', httpOnly: false, secure: false });
		}
	},
	sendEmail: async (event) => {
		const {
			locals: { currentLocale }
		} = event;
		const messages = await loadMessageCatalog(currentLocale);
		const sveltextContext = { locale: currentLocale, messages };
		const name = 'John';
		const title = _(msg`Test Email to ${name}`, sveltextContext);
		const body = _(msg`Hello ${name} from SvelteKit form actions!`, sveltextContext);
		console.log(
			`Sending email to the user with ${currentLocale}:\n\nTitle: ${title}\nBody: ${body}`
		);
	}
} satisfies Actions;
