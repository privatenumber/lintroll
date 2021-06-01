// Promise
const sleep = ms => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

async function someAsyncFunction() {
	return sleep(100);
}

type SomeObject = {
	propertyA: number,
	propertyB: number,
};

(async () => {
	await someAsyncFunction();
})();

const someNumber = 1;
console.log(<string>someNumber);
