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
				dependsOn: ['update', 'build'],
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
				dependsOn: ['update', '@qwikgear/metadata#build'],
			},
			'check:fix': {
				command: 'vp check --fix',
				dependsOn: ['update', '@qwikgear/metadata#build'],
			},
			test: {
				command: 'vpr -r test',
				dependsOn: ['update', '@qwikgear/metadata#build'],
			},
			'test:watch': {
				command: 'vpr -r test:watch',
				dependsOn: ['update', '@qwikgear/metadata#build'],
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
		overrides: [
			{
				files: ['**/*.ts'],
				rules: {
					'qwik/use-method-usage': 'off',
					'qwik/no-use-visible-task': 'off',
				},
			},
		],
	},
	staged: {
		'*': 'vp check --fix',
	},
});
