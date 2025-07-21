import './cts.cjs';
import './mts.mjs';
import './some-file.js';

// Promise
const sleep = (ms: number) => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

async function someAsyncFunction(_duration: number) {
	return await Reflect.apply(sleep, this, arguments);
}

type SomeObject = {
	ms: number;
};

type _AllowUnused = number;

export type Factory = <
	A,
	B,
>() => {
	a: A;
	b: B;
};

const anySpread = (...args: any[]) => args;

const isNumber = (n): n is number => typeof n === 'number';

const filtered = [1, '2'].filter(isNumber);

(async (parameter1: SomeObject) => {
	await someAsyncFunction(parameter1.ms);
})({
	ms: 10,
});

// eslint-disable-next-line no-console
console.log(
	anySpread,
	filtered,
);

export {};
