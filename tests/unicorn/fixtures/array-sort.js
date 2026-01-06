// slice().sort() is preferred over toSorted() for ES2022 compatibility
const numbers = [3, 1, 2];
const sorted = numbers.slice().sort();
console.log(sorted);
