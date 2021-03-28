'some-directive';

import './some-file.js';
import path from 'path';
import someModule from 'http://some.module/module.js';

// require('./some-file');

const message = 'hello world';

const objectMethods = {
	method() {
		return true;
	},
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

for (let i = 0; i < 10; i += 1) {
	if (i < 5) {
		continue;
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
function someFunction(objectValue, sourceValue) {
	if (Array.isArray(objectValue) && Array.isArray(sourceValue)) {
		return objectValue.concat(sourceValue);
	}
	Math.random(arguments);
}

// iife
(function named() {})();
(() => {})();

// Promise
const sleep = ms => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

async function someAsync() {
	return await sleep(100);
}

(async () => {
	await someAsync();

	for (let i = 0; i < 10; i += 1) {
		await someAsync();
	}
})();

// eslint-disable-next-line no-console
console.log(
	path,
	objectMethods,
	someModule,
	message,
	ternaryValue,
	someFunction,
);
