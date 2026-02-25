## 📦 Getting Started

```sh
npm i -D sveltext
```

Because SvelteKit supports both SPA and SSR rendering, `sveltext` is designed as a headless primitive that plugs directly into your existing data-loading pipeline.

Detailed documentation and a setup wizard are currently **WIP**. In the meantime, the easiest way to understand the setup is to look at the official example apps:

- **[SvelteKit SSR Example](https://github.com/chunnamwong/sveltext/tree/main/examples/ssr)** - Demonstrates cookie-based and `Accept-Language` header locale detection and server hooks.
- **[SvelteKit SPA Example](https://github.com/chunnamwong/sveltext/tree/main/examples/spa)** - Demonstrates client-side routing, `localStorage`, and `navigator.language` detection.

### The Core Concept (Manual Setup)

Regardless of your rendering strategy, the architecture requires four steps:

**1. The Config File**
Add a new file `sveltext.config.js` and prepare the `.po` catalogs:

```js
/** @type {import('sveltext').Config} */
const config = {
	locales: ['en', 'ja'],
	sourceLocale: 'en',
	catalog: {
		path: 'src/locales',
		include: ['src'],
	},
};

export default config;
```

**2. The Vite Plugin**
Add the compiler to your `vite.config.ts`:

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { sveltext } from 'sveltext/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		sveltext(), // Parses AST and hashes strings
	],
});
```

**3. Load .po catalogs in client or server hooks**

Depending on your rendering strategy, load the `.po` catalogs in either client hooks or server hooks. Once loaded, call setLocale to initialize the dictionary.

Here are some sample recipes:

**SSR** (`hooks.server.ts`):

```ts
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
		transformPageChunk: ({ html }) => html.replace('%lang%', currentLocale),
	});

	return response;
};
```

**SPA** (`hooks.client.ts`):

```ts
import { inferPreferredLanguage, setCurrentLocale } from '$lib/helpers';

const currentLocale = inferPreferredLanguage();

await setCurrentLocale(currentLocale);
```

**4. The Root Layout**

`sveltext` uses Svelte's native `{#key}` block for instant language switching.

```svelte
<script lang="ts">
    let { children } = $props();
</script>

<!-- The currentLocale implementation depends on the rednering strategy -->
{#key currentLocale}
    {@render children()}
{/key}
```
