/**
 * Build script that generates dist/oxlintrc.json from oxlint.config.ts.
 *
 * This resolves the oxlint limitation of requiring a config file on disk.
 * The TS config (with comments, types, split modules) is the source of truth.
 * This script evaluates it and writes a flat JSON file into dist/ for shipping.
 *
 * Also copies the CJS JS plugins into dist/ since oxlint loads them at runtime.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../..',
);

const buildOxlintConfig = async () => {
	// Import the TS config directly (this script runs during build, not at runtime)
	const configPath = path.join(projectRoot, 'oxlint.config.ts');
	const configModule = await import(configPath);
	const config = configModule.default;

	// Rewrite jsPlugins paths: ./src/custom-rules/... → ./custom-rules/...
	// (relative to dist/ after copying)
	if (config.jsPlugins) {
		config.jsPlugins = config.jsPlugins.map((entry: string | { name: string;
			specifier: string; }) => {
			if (typeof entry === 'string' && entry.startsWith('./src/custom-rules/')) {
				return entry.replace('./src/custom-rules/', './custom-rules/');
			}
			return entry;
		});
	}

	const distDirectory = path.join(projectRoot, 'dist');
	await fs.mkdir(distDirectory, { recursive: true });

	// Write the flat JSON config
	const jsonPath = path.join(distDirectory, 'oxlintrc.json');
	await fs.writeFile(jsonPath, JSON.stringify(config, null, '\t'));
	console.log(`Written ${path.relative(projectRoot, jsonPath)}`);

	// Copy CJS plugins to dist/custom-rules/
	const customRulesSource = path.join(projectRoot, 'src/custom-rules');
	const customRulesDist = path.join(distDirectory, 'custom-rules');
	await fs.mkdir(customRulesDist, { recursive: true });

	const allFiles = await fs.readdir(customRulesSource);
	const cjsFiles = allFiles.filter(file => file.endsWith('.cjs'));

	for (const file of cjsFiles) {
		await fs.copyFile(
			path.join(customRulesSource, file),
			path.join(customRulesDist, file),
		);
		console.log(`Copied ${path.relative(projectRoot, path.join(customRulesDist, file))}`);
	}
};

buildOxlintConfig();
