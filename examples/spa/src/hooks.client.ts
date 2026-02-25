import { inferPreferredLanguage, setCurrentLocale } from '$lib/helpers';

const currentLocale = inferPreferredLanguage();

await setCurrentLocale(currentLocale);
