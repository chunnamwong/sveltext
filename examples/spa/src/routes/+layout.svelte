<script lang="ts">
	import { resolve } from '$app/paths';
	import { t } from 'sveltext';
	import favicon from '$lib/assets/favicon.svg';
	import { setCurrentLocale } from '$lib/helpers';
	import { state } from '$lib/state.svelte.js';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#key state.currentLocale}
	<nav>
		<a href={resolve('/')}>
			{t`Home Page`}
		</a>
		|
		<a href={resolve('/test')}>
			{t`Sub Page`}
		</a>
	</nav>

	<section>
		<h2>{t`Switch language`}</h2>

		{#each ['en', 'ja'] as lang (lang)}
			{#if lang !== state.currentLocale}
				<button
					type="button"
					onclick={() => {
						setCurrentLocale(lang);
					}}
				>
					{lang}
				</button>
			{/if}
		{/each}
	</section>

	{@render children()}

	<footer>
		<hr />

		<p>
			Made with ❤️ by <a href="https://chunnamwong.com">Chun Nam Wong</a>
			<br />
			{t`Found a bug or weird edge case? Please open an issue:`}
			<a href="https://github.com/chunnamwong/sveltext">https://github.com/chunnamwong/sveltext</a>
		</p>
	</footer>
{/key}
