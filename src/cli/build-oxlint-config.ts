/**
 * Post-build script: copies CJS JS plugins to dist/custom-rules/
 *
 * oxlint loads these plugins at runtime via its NAPI bridge.
 * The main config (dist/oxlint/index.mjs) resolves plugin paths
 * via import.meta.url → ../custom-rules/*.cjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'../..',
);

const customRulesSource = path.join(projectRoot, 'src/custom-rules');
const customRulesDist = path.join(projectRoot, 'dist/custom-rules');

await fs.mkdir(customRulesDist, { recursive: true });

const allFiles = await fs.readdir(customRulesSource);
const cjsFiles = allFiles.filter(file => file.endsWith('.cjs'));

for (const file of cjsFiles) {
	await fs.copyFile(
		path.join(customRulesSource, file),
		path.join(customRulesDist, file),
	);
	console.log(`Copied dist/custom-rules/${file}`);
}
