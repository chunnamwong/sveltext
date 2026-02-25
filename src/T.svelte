<script lang="ts">
	import { getMessage } from './runtime.js';
	let { msg, ...snippets } = $props();
	let parts = $derived(getMessage(msg));
</script>

{#each parts as part, index (index)}
	{#if part in snippets}
		{@render snippets[part]?.()}
	{:else}
		{part}
	{/if}
{/each}
