import path from 'node:path';
import fs from 'node:fs';
import { cli } from 'cleye';
import packageJson from '../../package.json' with { type: 'json' };
import { run } from './run.ts';

const normalizePath = (filePath: string) => filePath.replaceAll('\\', '/');

const argv = cli({
	name: packageJson.name,
	parameters: ['[files...]'],
	help: {
		description: 'Opinionated linter by @privatenumber (Hiroki Osame)',
	},
	flags: {
		fix: {
			type: Boolean,
			description: 'Automatically fix problems',
		},
		staged: {
			type: Boolean,
			description: 'Only lint staged files',
		},
		git: {
			type: Boolean,
			description: 'Only lint git tracked files',
		},
		quiet: {
			type: Boolean,
			description: 'Report errors only',
		},
		ignorePattern: {
			type: [String],
			description: 'Pattern of files to ignore',
		},
		node: {
			type: [String],
			description: 'Enable Node.js rules',
		},
		allowAbbreviation: {
			type: [String],
			description: 'Allow abbreviations',
		},
	},
});

let { files } = argv._;
if (files.length === 0) {
	files = ['.'];
}

const cwd = fs.realpathSync.native(process.cwd());
files = files.map(f => normalizePath(
	fs.realpathSync.native(path.resolve(f)),
));

run({
	files,
	fix: argv.flags.fix ?? false,
	quiet: argv.flags.quiet ?? false,
	ignorePatterns: argv.flags.ignorePattern,
	staged: argv.flags.staged ?? false,
	git: argv.flags.git ?? false,
	cwd,
}).catch((error: unknown) => {
	console.error(`Error: ${(error as Error).message}`);
	process.exit(1);
});
