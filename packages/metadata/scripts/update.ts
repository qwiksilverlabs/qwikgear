import { writeFileSync, existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'pathe';
import { globSync } from 'tinyglobby';
import { ModuleMap } from '../types';

const modules = ['core', 'math', 'shared'];

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const rootDir = resolve(__dirname, '../../..');
const packageDir = resolve(__dirname, '..');
const packagesDir = resolve(rootDir, 'packages');

const searchPatterns = modules.flatMap((mod) => [`${mod}/**/use*`, `${mod}/**/logic*`]);

const rawFunctions = globSync(searchPatterns, {
	onlyDirectories: true,
	cwd: packagesDir,
	ignore: ['**/node_modules/**', '**/dist/**'],
});

function getHookDescription(path: string): string {
	if (!existsSync(path)) {
		return '';
	}

	let content = readFileSync(path, { encoding: 'utf-8' });

	content = content.replace(/^---[\s\S]*?---\s*/, '');
	content = content.replace(/^#+\s+.*$/gm, '');
	content = content.trim();

	const sentenceMatch = content.match(/^.*?[.!?](?:\s|$)/);

	return sentenceMatch ? sentenceMatch[0].trim() : content;
}

const result = Object.values(
	rawFunctions.reduce<ModuleMap>((acc, path) => {
		const parts = path.split('/').filter(Boolean);

		const moduleName = parts[0];
		const hookName = parts[parts.length - 1];

		if (!acc[moduleName]) {
			acc[moduleName] = { module: moduleName, hooks: [] };
		}

		acc[moduleName].hooks.push({
			name: hookName,
			description: getHookDescription(resolve(packagesDir, path, 'index.md')),
		});

		return acc;
	}, {}),
);

const outputPath = resolve(packageDir, 'index.json');

writeFileSync(outputPath, JSON.stringify(result, null, 2), { encoding: 'utf-8', flag: 'w' });
