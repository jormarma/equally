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

## equals(value1, value2 [, options])

This method compares two values for equality. It returns `true` if the objects are _equal_ and `false` otherwise. This method considers _equal_ as in the [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) method when primitive values are considered. For [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) and [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) objects, it first transforms them to its `String` representation using [`toISOString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) and [`toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/toString) expressions respectively and compare these strings. With `Object` and `Array` values, it compares its values at any level of depth, considering by default `Object` properties in any order and `Array` values in enumeration order. It is possible to change some defaults to make the comparison behave slightly different (see `options` below).

- `value1`: the first value to be compared for equality. It can be of any type.
- `value2`: the second value to compare. Also, it can be of any type.
- `options`: optional object to configure the way values are compared. By default, objects are compared regardles of the order of its properties, array elements must be in the same order, and the comparison of strings is case-sensitive. If you want to change this behavior, you can set the following options:
  - `orderedObjectProperties`: the properties of the objects to be compared must be traversed in the same order. The order must be the same as the given by the `Object.keys()` function. Default value is `false`.
  - `unorderedArrays`: elements in an array do not need to be in order to match. Default value is `false`.
  - `caseInsensitive`: to make string comparison _case-insensitive_, set this option to `true`. Default value is `false`.

### `equals` examples

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
            { n: 1 }eE
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

## differs(value1, value2)

This method returns an object with the differences between the two values. If the arguments are equal, it returns an empty object `{}`.
If at any level of depth the objects differ, it returns an object that tells us exactly what is different between both.

- `value1`: the first value to be compared. It can be a [_primitive_](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) value, a `Date`, a `RegExp`, an `Array` or an `Object`.
- `value2`: the second value to compare. It can hold the same types than `value1`.

### `differs` examples

The structure of the returned object is better explained with examples:

_Simple values, they are equal_:

```javascript
// The returned value is an object without any differences
// specified inside
const a = "one";
const b = "one";

const res = differs(a, b);
// res = {}
```

_Simple values, they are different_:

```javascript
// Values are different. The result specifies a property, "."
// that represents a path inside the value to get the point where
// both objects differ. In this case, the "." means the root value.
const a = "one";
const b = "two";

const res = differs(a, b);
// res = { ".": { 0: "one", 1: "two" }}
```

_Object values, they are different on **key1**_:

```javascript
// In this case, the objects differ in the value of the
// "key1" property, so the key specified is "key1".
// The value of the property is an object that holds
// 2 properties, 0 and 1, which represent the value
// in the first and second objects.
const a = { key1: "one", key2: "three" };
const b = { key1: "two", key2: "three" };

const res = differs(a, b);
// res = { ".[\"key1\"]": { 0: "one", 1: "two" }}
```

_Object values, they are different on **key1** and **key2** exists only in **a**_:

```javascript
// Here we have 2 differences between the objects.
// The first is in "key1" property, where in the first
// object, 0, the value is "one", while in the second, 1,
// the value is "two".
// In the second difference the first object has
// a property "key2" with value "three", but the second
// object does not have it. That is why this difference
// only has the property 0.
const a = { key1: "one", key2: "three" };
const b = { key1: "two" };

const res = differs(a, b);
// res = {
//    ".[\"key1\"]": { 0: "one", 1: "two" },
//    ".[\"key2\"]": { 0: "three" }
// }
```

_Array values, they are different on index **0**_:

```javascript
// The arrays are different at index 0, where
// the first array has the value of "one" while
// the second array has the value "two".
const a = [ "one", "three" ];
const b = [ "two", "three" ];

const res = differs(a, b);
// res = { ".[0]": { 0: "one", 1: "two" } }
```

_Array values, they are different on index **0** and index **1** exists only in **b**_:

```javascript
// Here, the arrays have 2 differences.
// First, at index 0 in both arrays, ".[0]", the
// first has value "one" while the second has value "two".
// The second difference at index 1, ".[1]", only the
// second array has a value, which is "three".
const a = [ "one" ];
const b = [ "two", "three" ];

const res = differs(a, b);
// res = {
//      ".[0]": { 0: "one", 1: "two" }
//      ".[1]": { 1: "three" }
// }
```

_Complex objects, they differ at different levels of depth_:

```javascript
// Given the previous examples, you could be able
// to deduce the meaning of the 4 differences
// that the differs method gets from the a and b objects.
const a = { x: "one", y: [ 1, 2, 4 ], z: null }
const b = { x: "two", y: [ 1, 3, 4, 5 ] }

const res = differs(a, b);
// res = {
//      ".[\"x\"]": { 0: "one", 1: "two" },
//      ".[\"y\"][1]": { 0: 2, 1: 3 },
//      ".[\"y\"][3]": { 1: 5 },
//      ".[\"z\"]": { 0: null },
// }
```

You can see that the `res` object contains key-value pairs where the keys represent the _path_ needed to achieve the difference between the values. The parts that you can see in it are the following:

- `"."` represents the _initial_ object. If it appears as the single value of a key, it represents the whole object.
- `"[\"object_key\"]"` when the value in the square brackets is wrapped in double quotes, it represents a property in an object.
- `"[num]"` when the value is numeric and it is not wrapped with double quotes, it represents an index in an array.

In the last example, the key `".[\"y\"][3]` represents the index `3` of an array that is the value of the `"y"` property of the given object. In the `b` object, that path represents the `b.y[3]` value, also achived with `b["y"][3]`, which is `5`.

The values of the result entries are objects that can have 1 or 2 keys. The keys could only be `0` and/or `1`. If both keys appear in the object, it means that both objects have values that can be reached following the key path. If only one of them is present, it means that only the first object, `0`, or the second object, `1`, have a value reached by the given key path.

### License

This package is under the [**Apache 2.0**]([https://](https://opensource.org/licenses/Apache-2.0)) license.

### Contact

For any comment or suggestion, you can always reach me here: [@jormarma](https://twitter.com/jormarma)
