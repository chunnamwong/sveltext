<script lang="ts">
	import { getMessage } from './runtime.js';
	let { msg, ...snippets } = $props();
	let parts = $derived(getMessage(msg.id));
</script>

{#each parts as part, index (index)}
	{#if part in snippets}
		{@render snippets[part]?.()}
	{:else if msg.args && part in msg.args}
		{msg.args[part]}
	{:else}
		{part}
	{/if}
{/each}
