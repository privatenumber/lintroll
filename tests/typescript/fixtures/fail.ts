import { TypeA } from './some-file';
import { type TypeB } from './some-file';
import { something } from './module.ts';

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

export type BadGeneric = <
  X,
  Y // ← missing comma
>() => void;

(async () => {
	await someAsyncFunction();
})();

const someNumber = 1;
console.log(<TypeA>someNumber);

// Truly useless constructor (no parameter properties)
class ActuallyUseless {
	name: string;

	constructor(name: string) {
		this.name = name;
	}
}

// Empty constructor without parameter properties
class EmptyUseless {
	constructor() {}
}

console.log(ActuallyUseless, EmptyUseless, something);

// Interface should fail (prefer type over interface)
interface BadInterface {
	foo: string;
}

export type { BadInterface };
