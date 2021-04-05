// Promise
const sleep = (ms: number) => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

async function someAsyncFunction(duration) {
	return await sleep(duration);
}

type SomeObject = {
	ms: number;
};

const isNumber = (n): n is number => typeof n === 'number';

const filtered = [1, '2'].filter(isNumber);

(async (parameter1: SomeObject) => {
	await someAsyncFunction(parameter1.ms);
})({
	ms: 10,
});

// eslint-disable-next-line no-console
console.log(
	filtered,
);
