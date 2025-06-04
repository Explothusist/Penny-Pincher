import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import Icons from 'unplugin-icons/vite'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    const serverConfig: {
        allowedHosts: string[];
        origin?: string;
        host?: boolean;
    } = {
        allowedHosts: [
            'pennypincher.mccown.io',
            'localhost',
            '127.0.0.1',
        ],
    };

    if (env.VITE_PUBLIC_ORIGIN) {
        serverConfig.origin = env.VITE_PUBLIC_ORIGIN;
    }

    return {
		plugins: [sveltekit(), Icons({compiler: "svelte"})],
        server: serverConfig,
    };
});