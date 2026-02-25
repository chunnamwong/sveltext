<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { t } from 'sveltext';
	import favicon from '$lib/assets/favicon.svg';
	import { setCurrentLocale } from '$lib/helpers';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#key data.currentLocale}
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
			{#if lang !== data.currentLocale}
				<form
					method="POST"
					action="/?/setLocale"
					use:enhance
					onsubmit={() => {
						setCurrentLocale(lang);
					}}
				>
					<input type="hidden" name="locale" value={lang} />
					<button type="submit">
						{lang}
					</button>
				</form>
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
