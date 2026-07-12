import { describe, expect, test } from 'manten';
import { getExitCode } from '../../src/cli/handle-errors.ts';

describe('CLI exit codes', () => {
	test('returns 0 without errors', () => {
		expect(getExitCode({
			errorCount: 0,
			fatalErrorCount: 0,
			warningCount: 1,
		})).toBe(0);
	});

	test('returns 1 for lint errors', () => {
		expect(getExitCode({
			errorCount: 1,
			fatalErrorCount: 0,
			warningCount: 0,
		})).toBe(1);
	});

	test('returns 2 for fatal errors', () => {
		expect(getExitCode({
			errorCount: 1,
			fatalErrorCount: 1,
			warningCount: 0,
		})).toBe(2);
	});
});
