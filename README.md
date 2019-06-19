# Equally

[![Build Status](https://travis-ci.org/jormarma/equally.svg?branch=master)](https://travis-ci.org/jormarma/equally)

This project is a simple method to deeply compare two Javascript values for equality.

## Instalation and usage

You only have to install `equally` using the regular procedure with npm:

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

The order of the fields of an object are irrelevant:

```javascript
equals({ a: 1, b: 2 }, { b: 2, a: 1 }); // true
```

On the other hand, order of arrays is important:

```javascript
equals([ 1, 2 ], [ 2, 1 ]); // false
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

### License

This package is under the [**Apache 2.0**]([https://](https://opensource.org/licenses/Apache-2.0)) license.

### Contact

For any comment or suggestion, you can always reach me here: [@jormarma](https://twitter.com/jormarma)