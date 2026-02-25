import { parseMessage } from './po.js';

/** @type {Record<string, unknown[]>} */
let _messages;
/** @type {Intl.PluralRules} */
let _pr;
/** @type {string} */
export let locale;

export function getMessage(id) {
	let message = _messages[id];

	if (!message) {
		if (import.meta.env.DEV) {
			return parseMessage(id);
		}

		return [id];
	}

	return message;
}

export function t(id, args) {
	const tokens = getMessage(id);

	if (typeof args === 'object') {
		return tokens
			.map((token) => (typeof args?.[token] !== 'undefined' ? args[token] : token))
			.join('');
	}

	if (tokens[0][1] === 'plural' && typeof args === 'number') {
		const selectors = tokens[0][2];
		const category = _pr.select(args);
		const selectorTokens = category in selectors ? selectors[category] : selectors['other'];
		return selectorTokens.map((token) => (token === '#' ? args : token)).join('');
	}

	return tokens.join('');
}

export async function setLocale(_locale, messages) {
	locale = _locale;
	_messages = messages;
	_pr = new Intl.PluralRules(_locale);
}
