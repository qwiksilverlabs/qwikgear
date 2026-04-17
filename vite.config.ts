import { defineConfig } from 'vite-plus';
import { strict } from 'oxlint-plugin-qwik/ruleset';

export default defineConfig({
	run: {
		cache: false,
		tasks: {
			build: {
				command: 'vp run -r build',
				dependsOn: ['update', '@lazyqwik/metadata#build'],
			},
			'docs:build': {
				command: 'vitepress build packages',
				dependsOn: ['update', '@lazyqwik/metadata#build'],
			},
			docs: {
				command: 'vitepress dev packages',
				dependsOn: ['update'],
			},
		},
	},
	fmt: {
		useTabs: true,
		tabWidth: 4,
		printWidth: 100,
		endOfLine: 'lf',
		bracketSameLine: true,
		singleQuote: true,
		ignorePatterns: ['dist/**', 'node_modules/**', '**/index.json'],
		overrides: [
			{
				files: ['*.yml', '*.yaml', '*.md'],
				options: {
					tabWidth: 2,
					useTabs: false,
				},
			},
		],
	},
	lint: {
		options: { typeAware: true, typeCheck: true },
		ignorePatterns: ['dist/**', 'node_modules/**'],
		jsPlugins: ['oxlint-plugin-qwik'],
		extends: [strict],
	},
	staged: {
		'*': 'vp check --fix',
	},
});
