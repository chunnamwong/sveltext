import { sveltekit } from '@sveltejs/kit/vite';
import { sveltext } from 'sveltext/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	preview: {
		port: 5173
	},
	plugins: [sveltekit(), sveltext()]
});
