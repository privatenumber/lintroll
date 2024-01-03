'some-directive';

import { readFile, writeFile, stat } from 'fs';
import './some-file.js';

// require('./some-file');

const message = 'hello world';

const objectMethods = {
	method: () => true,
	'method-a': () => true,
};

const objectSingle = { a: 1 };

const objectMulti = {
	a: 1,
	b: 2,
};

const range = [1, 2, 3, 4];
const [destructure] = range;
const allowIndexAccess = range[3]; // Destructuring this would be too complex
objectMulti.a = range[1];
const { a: destructure2 } = objectMulti;

// Ternary
const ternaryValue = (
	Math.random() > 0.5
		? 1
		: 2
);
// => 1 or 2

OUTERLOOP:
for (let i = 0; i < 10; i += 1) {
	if (i < 5) {
		continue;
	} else {
		for (let j = 0; j < 10; j += 2) {
			if (Math.random()) {
				break OUTERLOOP;
			}
		}
	}
}

for (const element of []) {
	Math.random(element);
}

for (const property in Math) {
	if (Object.prototype.hasOwnProperty.call(Math, property)) {
		Math[property]();
	}
}

// function
function someFunction(objectValue, sourceValue, ...args) {
	if (Array.isArray(objectValue) && Array.isArray(sourceValue)) {
		return objectValue.concat(sourceValue, args);
	}
	Math.random(arguments);
}

// iife
(function named() {
	return this;
})();
(() => {})();

// Promise
const sleep = ms => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

const someAsync = async () => await sleep(100);

(async () => {
	await someAsync();

	for (let i = 0; i < 10; i += 1) {
		await someAsync();
	}

	if (someAsync()) {
		await someAsync();
	} else {
		await someAsync();
	}
})();

sleep().then(
	() => {
		someAsync();
	},
	(error) => {
		throw error;
	},
);

const someRegexp = /\[placeholder\]/;

try {
	throw new Error('some error');
} catch {}

// eslint-disable-next-line no-console
console.log(
	readFile,
	writeFile,
	destructure,
	destructure2,
	allowIndexAccess,
	stat,
	objectMethods,
	objectSingle,
	objectMulti,
	message,
	ternaryValue,
	someFunction,
	someRegexp,
);
