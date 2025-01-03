import { TypeA } from './some-file';
import { type TypeB } from './some-file';

const unusedVar = 1

type UnusedType = TypeB;

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
console.log(<TypeA>someNumber);

export {};
