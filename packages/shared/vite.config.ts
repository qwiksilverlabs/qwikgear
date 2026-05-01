import { defineConfig } from 'vite-plus';
import { qwikVite } from '@builder.io/qwik/optimizer';

export default defineConfig({
	pack: {
		entry: ['./src/index.ts'],
		format: ['esm'],
		dts: true,
		clean: true,
		outExtensions: () => ({ js: '.qwik.mjs', dts: '.d.ts' }),
	},

	resolve: {
		tsconfigPaths: true,
	},

	plugins: [qwikVite()],
});
