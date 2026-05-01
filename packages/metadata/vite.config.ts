import { defineConfig } from 'vite-plus';

export default defineConfig({
	pack: {
		entry: ['./index.ts', './types.ts'],
		format: ['esm'],
		dts: true,
		clean: true,
		exports: true,
	},

	resolve: {
		tsconfigPaths: true,
	},
});
