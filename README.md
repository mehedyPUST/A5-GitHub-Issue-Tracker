## 1.  What is the difference between var, let, and const?

## var:
Function-scoped or globally-scoped

Can be redeclared and updated

Hoisted to the top of their scope

Can be accessed before declaration (returns undefined)

```
javascript
var name = "John";
var name = "Doe"; // Redeclaration allowed
console.log(name); // "Doe"
```

## let:

Block-scoped

Can be updated but not redeclared in the same scope

Hoisted but not initialized (Temporal Dead Zone)

```
javascript
let age = 25;
age = 26; // Update allowed
// let age = 30; // Error: Cannot redeclare
```

## const:

Block-scoped

Cannot be updated or redeclared

Must be initialized at declaration

For objects/arrays, the reference cannot change but properties can
```
javascript
const PI = 3.14;
// PI = 3.15; // Error: Cannot reassign

const person = { name: "John" };
person.name = "Doe"; // This is allowed
// person = {}; // Error: Cannot reassign
```


## 2. What is the spread operator (...)?

The spread operator allows an iterable to expand in places where multiple elements/variables are expected. It's used to copy, combine, or expand arrays and objects.

Examples:
```
javascript
// Arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
const copyArr = [...arr1]; // Copy array

// Objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const mergedObj = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// Function arguments
const numbers = [1, 2, 3, 4, 5];
console.log(Math.max(...numbers)); // 5
```

## 3. What is the difference between map(), filter(), and forEach()?

## forEach():

Executes a function for each array element

Returns undefined

Does not create a new array

Used for side effects
```
javascript
const numbers = [1, 2, 3, 4];
numbers.forEach(num => console.log(num * 2));
// Output: 2, 4, 6, 8
// Returns: undefined
```


## map():

Creates a new array with results of calling a function on every element

Returns a new array of the same length

Used for transforming data
```
javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8]

```

## filter():

Creates a new array with elements that pass a test

Returns a new array (may be shorter)

Used for filtering data based on conditions
```
javascript
const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = numbers.filter(num => num % 2 === 0);
console.log(evenNumbers); // [2, 4, 6]
```

## 5. What is an arrow function?

Arrow functions are a concise way to write function expressions in JavaScript. They have a shorter syntax and lexically bind the this value.

Syntax:
```
javascript
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// With single parameter (parentheses optional)
const square = x => x * x;

// With no parameters
const greet = () => "Hello World";

// With multiple statements
const process = (a, b) => {
    const result = a + b;
    return result * 2;
};
```
Key Features:

No this binding (inherits from parent scope)

Cannot be used as constructors

No arguments object

Cannot be used as methods if you need to access this

## 5. What are template literals?

Template literals are string literals allowing embedded expressions, multi-line strings, and string interpolation using backticks (` `) and ${} syntax.

Examples:
```
javascript
// Basic usage
const name = "John";
const greeting = `Hello, ${name}!`; // "Hello, John!"

// Multi-line strings
const multiLine = `
    This is a
    multi-line
    string
`;

// Expressions
const a = 10;
const b = 20;
const result = `The sum of ${a} and ${b} is ${a + b}`; 
// "The sum of 10 and 20 is 30"

// Function calls
const price = 50;
const tax = 0.1;
const message = `Total: $${(price * (1 + tax)).toFixed(2)}`;
// "Total: $55.00"

```

Benefits:

Cleaner string concatenation

Easy multi-line strings

Can embed any JavaScript expression

More readable and maintainable code