import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite'

export default defineConfig({
	plugins: [sveltekit(), Icons({compiler: "svelte"})],
	server: {
		allowedHosts: [
			"pennypincher.mccown.io",
			"localhost",
			"127.0.0.1"
		]
	}
});
