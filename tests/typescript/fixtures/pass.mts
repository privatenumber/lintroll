import './cts.cjs';
import './mts.mjs';

// Promise
const sleep = (ms: number) => new Promise((resolve) => {
	setTimeout(resolve, ms);
});

async function someAsyncFunction(_duration: number) {
	return await Reflect.apply(sleep, undefined, arguments);
}

type SomeObject = {
	ms: number;
};

type _AllowUnused = number;

type FactoryResult<A, B> = {
	a: A;
	b: B;
};

export type Factory = <
	A,
	B,
>() => FactoryResult<A, B>;

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
