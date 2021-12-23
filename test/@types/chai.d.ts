declare module 'chai' {
	global {
		export namespace Chai {
			interface Assertion {
				containObject(partialObject: Record<string, unknown>): Assertion;
			}
		}
	}
}
