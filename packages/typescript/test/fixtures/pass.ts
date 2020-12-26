// Promise
const sleep = (ms: number) => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

async function someAsyncFunction() {
	return await sleep(100);
}

(async () => {
	await someAsyncFunction();
})();

// eslint-disable-next-line no-console
console.log(
	message,
	ternaryValue,
);
