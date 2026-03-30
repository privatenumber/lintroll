/**
 * File patterns to ignore during linting.
 * Shared between oxlint and the file categorization in the CLI.
 */
export const ignorePatterns = [
	'**/package-lock.json',
	'**/pnpm-lock.yaml',
	'{tmp,temp,.tmp,.temp,__tmp__,__temp__}/**',
	'**/*.min.js',
	'**/dist/**',
	'**/node_modules/**',
	'**/vendor/**',
	'**/.cache/**',
	'**/.vitepress',

	// AI assistant documentation files
	'**/CLAUDE.md',
	'**/CLAUDE.local.md',
	'**/.claude',
	'**/AI.md',
	'**/AGENT.md',
	'**/PROMPT.md',
	'**/PROMPTING.md',

	// Cursor IDE
	'**/.cursorrules',
	'**/.cursorignore',
	'**/.cursormem.json',
	'**/.cursorhistory',

	// GitHub Copilot
	'**/copilot.json',
	'**/copilot.config.json',
	'**/copilot.md',
];
