const isDef = (value) => value !== null && value !== undefined;

const anyUndef = (... values) => !values.every(isDef);

const isComparableType = (value) => (
    value === null // null
    || value === undefined // undefined
    || value.constructor === RegExp // RegExp
    || value.constructor === Date   // Date
    || !["object", "symbol", "function"].includes(typeof value) // undefined, boolean, number, bigint, string
);

const getNumericType = (type) => {
    switch (type) {
    case "undefined": return 1;
    case "boolean": return 2;
    case "number": return 3;
    case "bigint": return 4;
    case "Date": return 5;
    case "RegExp": return 6;
    case "string": return 7;
    default: return 0; // "null"
    }
};

const getType = (value) => {
    if (value === null) {
        return "null";
    }

    let valueType = typeof value;

    if (valueType === "object") {
        return value.constructor.name;
    }

    return valueType;
};

const sortArrayValues = (first, second) => {
    // Check remaining types (no null or undefined)
    let typeFirst = getType(first);
    let typeSecond = getType(second);

    if (typeFirst === typeSecond) {
        if (typeFirst === "undefined" || typeFirst === "null") {
            return 0;
        }

        if (typeFirst === "Date") { // Date
            return first.toISOString().localeCompare(second.toISOString());
        }

        return first.toString().localeCompare(second.toString());
    }

    return Math.sign(getNumericType(typeFirst) - getNumericType(typeSecond));
};

const areComparableTypes = (... values) => values.every(isComparableType);

// same own properties, same values, any order
const equalObjects = (obj1, obj2, options) => {
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (!options || !options.orderedObjectProperties) {
        keys1 = keys1.sort();
        keys2 = keys2.sort();
    }

    if (!equalArrays(keys1, keys2, options)) {
        return false;
    }

    return keys1.every((value1, index) =>
        equals(obj1[value1], obj2[keys2[index]], options)
    );
};

// same length, same values, same order
const equalArrays = (array1, array2, options) => {
    const length1 = array1.length;

    if (length1 !== array2.length) {
        return false;
    }

    if (options && options.unorderedArrays && areComparableTypes(...array1)) {
        array1.sort(sortArrayValues);
        array2.sort(sortArrayValues);
    }

    for (let i = 0; i < length1; i += 1) {
        if (!equals(array1[i], array2[i], options)) {
            return false;
        }
    }

    return true;
};

const equals = (value1, value2, options) => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
    if (Object.is(value1, value2)) {
        return true;
    }

    // If objects are not the same, and any of them is undef, then they are different
    if (anyUndef(value1, value2)) {
        return false;
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime
    if (value1.constructor === Date && value2.constructor === Date) {
        return value1.toISOString() === value2.toISOString();
    }

    if (value1.constructor === RegExp && value2.constructor === RegExp) {
        return value1.toString() === value2.toString();
    }

    // If both are objects, they have a special treatment
    if (value1.constructor === Object && value2.constructor === Object) {
        return equalObjects(value1, value2, options);
    }

    // If both are arrays, they have a special treatment
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
    if (Array.isArray(value1) && Array.isArray(value2)) {
        return equalArrays(value1, value2, options);
    }

    return false;
};

module.exports = {
    equals,
    isComparableType,
    areComparableTypes,
    sortArrayValues
};