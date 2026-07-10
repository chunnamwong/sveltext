import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sveltext } from 'sveltext/vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		// [Sveltext]: Load Vite plugin to compile the t or plural function calls
		sveltext()
	]
});
