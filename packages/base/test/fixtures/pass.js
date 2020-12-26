'some-directive';

import './some-file.js';
import path from 'path';

// require('./some-file');

const message = 'hello world';

// Ternary
const ternaryValue = (
	Math.random() > 0.5
		? 1
		: 2
);

// Promise
const sleep = ms => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

async function someAsync() {
	return await sleep(100);
}

(async () => {
	await someAsync();
})();

// eslint-disable-next-line no-console
console.log(
	path,
	message,
	ternaryValue,
);
