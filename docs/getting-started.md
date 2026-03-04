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

**3. Decide Locale Matching Strategy**

<details>
  <summary>For SSR: Cookie-based and Accept-Language Header Detection</summary>

**3.1 Extend event.locals**

Modify **app.d.ts** to add a `currentLocale` field to `event.locals`

```ts
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			currentLocale: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
```

**3.2** Detect locale in `hooks.server.ts`

Create or modify `hooks.server.ts` to determine the locale when a request starts processing:

```ts
import type { Handle } from '@sveltejs/kit';

function inferPreferredLocale(acceptLanguageHeader: string | null) {
	if (acceptLanguageHeader) {
		if (acceptLanguageHeader.startsWith('en')) {
			return 'en';
		}

		if (acceptLanguageHeader.startsWith('ja')) {
			return 'ja';
		}
	}

	return 'en';
}

export const handle: Handle = async ({ event, resolve }) => {
	let currentLocale = event.cookies.get('currentLocale');

	if (!currentLocale) {
		currentLocale = inferPreferredLocale(event.request.headers.get('accept-language'));
	}

	event.locals.currentLocale = currentLocale;
	event.cookies.set('currentLocale', currentLocale, {
		path: '/',
		httpOnly: false,
		secure: false,
	});

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', currentLocale),
	});

	return response;
};
```

</details>

<details>
  <summary>For SPA: `localStorage`, and `navigator.language` Detection</summary>

Create reusable helper functions for locale detection and matching.

They will be used in `layout.ts` in the next step to initialize the client-side locale.

```ts
export async function setCurrentLocale(locale: string) {
	localStorage.setItem('currentLocale', locale);
}

const supportedLocales = ['en', 'ja'];

export function getCurrentLocale() {
	const localStorageLocale = localStorage.getItem('currentLocale');

	if (localStorageLocale) {
		return localStorageLocale;
	}

	const preferredLocale = navigator.languages.find((language) =>
		supportedLocales.includes(language),
	);

	if (preferredLocale) {
		return preferredLocale;
	}

	return 'en';
}
```

</details>

**Load the Message Catalog in the Root Layout `load` Function**

<details>
  <summary>For SSR: Use the Locale from event.locals to Load the Catalog</summary>

During server-side rendering, read the locale previously injected into `event.locals` by `hooks.server.ts`, and use it to load the corresponding message catalog in the root layout's `load` function. This ensures the correct catalog is selected per request and avoids cross-request state pollution by keeping locale resolution request-scoped and deterministic.

**src/routes/+layout.server.ts**

```ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const currentLocale = locals.currentLocale;
	const { messages } = await import(`../locales/${currentLocale}.po`);
	return {
		currentLocale,
		messages,
	};
};
```

</details>

<details>
  <summary>For SPA: Use the Detected Locale to Load the Catalog</summary>

In a client-side environment, call the helper functions to determine locale and load the appropriate message catalog in the root layout's `load` function.

**src/routes/+layout.ts**

```ts
import type { LayoutLoad } from './$types';
import { getCurrentLocale } from '$lib/i18n';

export const ssr = false;

export const load: LayoutLoad = async () => {
	const currentLocale = getCurrentLocale();
	const { messages } = await import(`../locales/${currentLocale}.po`);

	return {
		currentLocale,
		messages,
	};
};
```

</details>

**5. The Root Layout Component**

Sveltext uses the `SveltextRoot` component inside Svelte's native `{#key}` block to manage locale state. When `data.currentLocale` changes, the entire render tree is destroyed and recreated with the new locale. This guarantees that all components are re-initialized with the correct message catalog and prevents stale translations.

**src/routes/+layout.svelte**

⚠️ Translation functions are **not available directly inside this file**. Because the layout is responsible for bootstrapping the locale and catalog, translations cannot be evaluated at this level.

If you need translated content in layout-level UI (such as headers or footers), create a separate component and render it inside `<SveltextRoot>`. Translations should always live within the initialized Sveltext component tree.

```svelte
<script lang="ts">
	import { SveltextRoot } from 'sveltext';
    let { data, children } = $props();
</script>

{#key data.currentLocale}
	<SveltextRoot locale={data.currentLocale} messages={data.messages}>
        {/* ⚠️ Writing t`Test` right here will crash */}
        {@render children()}
        {/* ✅ Place translated content inside a separate component */}
        <Footer />
	</SveltextRoot>
{/key}
```
