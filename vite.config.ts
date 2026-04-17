import { defineConfig } from 'vite-plus';
import { strict } from 'oxlint-plugin-qwik/ruleset';

export default defineConfig({
	run: {
		cache: false,
		tasks: {
			build: {
				command: 'vp run -r build',
				dependsOn: ['update'],
			},
			'docs:build': {
				command: 'vitepress build packages',
				dependsOn: ['update', '@lazyqwik/metadata#build'],
			},
			docs: {
				command: 'vitepress dev packages',
				dependsOn: ['update'],
			},
			'docs:preview': {
				command: 'vitepress preview packages',
				dependsOn: ['docs:build'],
			},
			check: {
				command: 'vp check',
				dependsOn: ['update', '@lazyqwik/metadata#build'],
			},
			'check:fix': {
				command: 'vp check --fix',
				dependsOn: ['update', '@lazyqwik/metadata#build'],
			},
			test: {
				command: 'vpr -r test',
				dependsOn: ['update', '@lazyqwik/metadata#build'],
			},
			'test:watch': {
				command: 'vpr -r test:watch',
				dependsOn: ['update', '@lazyqwik/metadata#build'],
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
