import { chai } from 'vitest';

chai.use((_chai, utils) => {
	chai.Assertion.addMethod('containObject', function function_(objectLike) {
		const matches = utils.flag(this, 'object').some(
			element => Object.keys(objectLike).every(key => element[key] === objectLike[key]),
		);

		const negate = utils.flag(this, 'negate');
		if (negate) {
			if (matches) {
				throw new Error(`Found: ${JSON.stringify(objectLike)}`);
			}
		} else if (!matches) {
			throw new Error(`Not found: ${JSON.stringify(objectLike)}`);
		}
	});
});
