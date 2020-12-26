// Promise
const sleep = ms => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

async function someAsyncFunction() {
	return sleep(100);
}

(async () => {
	await someAsyncFunction();
})();

// eslint-disable-next-line no-console
console.log(
	message,
	ternaryValue,
);
