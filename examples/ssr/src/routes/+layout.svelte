<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { SveltextRoot } from 'sveltext';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#key data.currentLocale}
	<SveltextRoot locale={data.currentLocale} messages={data.messages}>
		<Header currentLocale={data.currentLocale} />

		{@render children()}

		<Footer />
	</SveltextRoot>
{/key}
