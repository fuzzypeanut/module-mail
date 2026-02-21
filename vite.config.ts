import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [svelte()],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			formats: ['es'],
			fileName: 'remoteEntry'
		},
		// Ensure the output can be loaded cross-origin from the shell
		target: 'esnext'
	}
});
