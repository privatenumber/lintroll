import { expect as _expect } from 'manten';
import path from 'node:path';

export { _expect, path };

export const isZero = (value) => {
	let number = Number(value);
	return number == 0;
};

export const wrapped = Promise.resolve(1).then(value => Promise.resolve(value));
export const digitPattern = /[0-9]/u;
console.log('warning');
export const parsed = parseInt("1", 10)
