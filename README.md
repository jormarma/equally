# Equally

[![Build Status](https://travis-ci.org/jormarma/equally.svg?branch=master)](https://travis-ci.org/jormarma/equally)

This project is a simple method to deeply compare two Javascript values for equality.

## Instalation and usage

You only have to install `equally` using the regular procedure with `npm`:

```javascript
npm install equally
```

In any file you want to use it, the only thing needed is to import it like this:

```javascript
const { equals } = require('equally');
```

And after that, you can use it to compare two values:

```javascript
const object1 = { a: 1, b: "one", c: /.?/, d: new Date("2020-02-20") };
const object2 = { b: "one", d: new Date("2020-02-20"), c: /.?/, a: 1 };

console.log(equals(object1, object2));
// true
```

## Examples

Primitive values are compared as expected:

```javascript
equals(NaN, NaN); // true
equals(null, undefined); // false
equals(Infinity, Number.POSITIVE_INFINITY); // true
equals("one", "One"); // false
```

By default, the object properties order is irrelevant:

```javascript
equals({ a: 1, b: 2 }, { b: 2, a: 1 }); // true
```

On the other hand, order of arrays is important:

```javascript
equals([ 1, 2 ], [ 2, 1 ]); // false
```

You can configure the equals method to take into consideration the order of the properties in an object using an optional configuration object with the `orderedObjectProperties` property set to `true`:

```javascript
equals({ a: 1, b: 2 }, { b: 2, a: 1 }, { orderedObjectProperties: true }); // false
equals({ a: 1, b: 2 }, { a: 1, b: 2 }, { orderedObjectProperties: true }); // true
```

You can also configure the equals method to consider arrays as unordered sets of values using an optional configuration object with the `unorderedArrays` property set to `true`:

```javascript
equals([ 1, 2 ], [ 2, 1 ], { unorderedArrays: true }); // true
```

You can also compare complex objects of any depth:

```javascript
const object1 = {
    a : new Date("2020-02-02"),
    b : {
        c : null,
        d : [
            {},
            { n: 1 }
        ]
    }
};

const object2 = {
    b : {
        c : null,
        d : [
            {},
            { n: 1 }
        ]
    },
    a : new Date("2020-02-02")
};

equals(object1, object2); // true
```

And you can can use any combination in the options object:


```javascript
let object1 = { a : 1, b : [ 1, 2 ] };
let object2 = { a : 1, b : [ 2, 1 ] };
let options = {
    unorderedArrays: true,
    orderedObjectProperties: false // default is false
};

equals(object1, object2, options); // true

let object1 = { a : 1, b : [ 1, 2 ] };
let object2 = { b : [ 2, 1 ], a : 1 };
let options = {
    unorderedArrays: true,
    orderedObjectProperties: true
};

equals(object1, object2, options); // false
```

### License

This package is under the [**Apache 2.0**]([https://](https://opensource.org/licenses/Apache-2.0)) license.

### Contact

For any comment or suggestion, you can always reach me here: [@jormarma](https://twitter.com/jormarma)
