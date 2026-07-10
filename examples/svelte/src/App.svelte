<script lang="ts">
	import { SveltextRoot } from 'sveltext';
	import Page from './Page.svelte';
	import Footer from './Footer.svelte';
	import { loadMessageCatalog } from './lib/i18n';

	let currentLocale: 'en' | 'ja' = 'en';
</script>

{#key currentLocale}
	{#await loadMessageCatalog(currentLocale) then messages}
		<SveltextRoot locale={currentLocale} {messages}>
			{#if currentLocale === 'en'}
				<button onclick={() => (currentLocale = 'ja')}>ja</button>
			{:else}
				<button onclick={() => (currentLocale = 'en')}>en</button>
			{/if}
			<!-- [Sveltext]: ⚠️ Writing t`Test` right here will crash -->
			<!-- [Sveltext]: ✅ Place translated content inside a separate component -->
			<Page />
			<Footer />
		</SveltextRoot>
	{/await}
{/key}
