<script lang="ts">
	import { c, msg, plural, t, T } from 'sveltext';
	import { errors } from '$lib/helpers';

	let name = 'John Doe';
	let greeting = msg`Hello ${name}!`;
	let itemCount = $state(1);

	const itemLabel = $derived(
		plural(itemCount, {
			one: '# item',
			other: '# items'
		})
	);

	const summary = $derived(t`Hello ${name}. You have ${itemLabel}.`);

	function goRefresh(success = true) {
		if (success) {
			itemCount = 1;
			alert(t`Refreshed`);
			return;
		}

		alert(t(errors.sync));
	}
</script>

<section>
	<h2>{t`Plural`}</h2>

	<p>{itemLabel}</p>

	<div>
		<button type="button" onclick={() => (itemCount = Math.max(0, itemCount - 1))}>-</button>
		<button type="button" onclick={() => itemCount++}>+</button>
	</div>
</section>

<section>
	<h2>{t`Interpolation and composition`}</h2>

	<p style="white-space: pre-wrap;">
		{t`Line 1\nLine 2`}
	</p>

	<p>{t(greeting)}</p>

	<p>{t`You have ${itemCount} (${itemLabel}).`}</p>

	<p>{t`Interpolated context message: ${c('badge').t`New`}`}</p>

	<p>{summary}</p>
</section>

<section>
	<h2>{t`Component interpolation`}</h2>

	<T msg={msg`Toolbar: {refresh} {refreshFail}`}>
		{#snippet refresh()}
			<button type="button" onclick={() => goRefresh(true)}>
				{t`Refresh`}
			</button>
		{/snippet}

		{#snippet refreshFail()}
			<button type="button" onclick={() => goRefresh(false)}>
				{t`Refresh (fail)`}
			</button>
		{/snippet}
	</T>
</section>
