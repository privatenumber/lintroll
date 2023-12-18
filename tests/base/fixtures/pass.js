'some-directive';

import './some-file.js';
import path from 'path';

// require('./some-file');

const message = 'hello world';

const objectMethods = {
	method: () => true,
	'method-a'() {
		return true;
	},
};

// Ternary
const ternaryValue = (
	Math.random() > 0.5
		? 1
		: 2
);

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
	path,
	objectMethods,
	message,
	ternaryValue,
	someFunction,
	someRegexp,
);
