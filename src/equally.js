const isUndef = (value) => value === null || value === undefined;

const someUndef = (... values) => values.some(isUndef);

const isComparableType = (value) => (
    isUndef(value)
    || value.constructor === RegExp // RegExp
    || value.constructor === Date   // Date
    || !["object", "function"].includes(typeof value) // undefined, boolean, number, bigint, symbol, string
);

const equalsStrings = (value1, value2, options) =>
    options
    && options.caseInsensitive === true
    && typeof value1 === "string"
    && typeof value2 === "string"
    && value1.toLowerCase() === value2.toLowerCase();

const areComparableTypes = (... values) => values.every(isComparableType);

const getSortableTypename = (type) => {
    switch (type) {
    case "null": return "0";
    case "undefined": return "1";
    case "boolean": return "2";
    case "number": return "3";
    case "bigint": return "4";
    case "Date": return "5";
    case "RegExp": return "6";
    case "symbol": return "7";
    case "string": return "8";
    default: return type;
    }
};

const getType = (value) => {
    let valueType = typeof value;

    if (valueType === "object") {
        return value === null
            ? "null"
            : value.constructor.name;
    }

    return valueType;
};

const sortArrayValues = (first, second) => {
    // Check remaining types (no null or undefined)
    let typeFirst = getType(first);
    let typeSecond = getType(second);

    if (typeFirst === typeSecond) {
        switch (typeFirst) {
        case "null":
        case "undefined":
            return 0;

        case "Date":
            return first.toISOString().localeCompare(second.toISOString());

        default:
            // TODO: this does not work when objects or arrays
            // Everything else, compare the string representation
            return first.toString().localeCompare(second.toString());
        }
    }

    // If different types, sort by type
    return getSortableTypename(typeFirst).localeCompare(getSortableTypename(typeSecond));
};

// same own properties, same values, any order
const equalObjects = (obj1, obj2, options) => {
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    if (!options || !options.orderedObjectProperties) {
        keys1 = keys1.sort();
        keys2 = keys2.sort();
    }

    return equalArrays(keys1, keys2) &&
        keys1.every((value1, index) =>
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
        // sorts elements "in place"
        array1.sort(sortArrayValues);
        array2.sort(sortArrayValues);
    }

    return array1.every((value, index) =>
        equals(value, array2[index], options)
    );
};

const equals = (value1, value2, options) => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
    if (Object.is(value1, value2) || equalsStrings(value1, value2, options)) {
        return true;
    }

    // If objects are not the same, and any of them is null or undefined,
    // then they are different
    if (someUndef(value1, value2)) {
        return false;
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

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime
    if (value1.constructor === Date && value2.constructor === Date) {
        return value1.toISOString() === value2.toISOString();
    }

    if (value1.constructor === RegExp && value2.constructor === RegExp) {
        return value1.toString() === value2.toString();
    }

    return false;
};

const DIRECTLY_COMPARABLE_TYPES = ["undefined", "null", "boolean", "number", "bigint", "symbol", "string"];

const differs = (value1, value2, initialDifference, rootContext) => {
    const context = rootContext || ".";
    let difference = initialDifference || {};

    const type1 = getType(value1);
    const type2 = getType(value2);

    // different types
    if (type1 !== type2) {
        difference[context] = { 0: value1, 1: value2 };
        return difference;
    }

    // simple types and different values
    if (DIRECTLY_COMPARABLE_TYPES.includes(type1)) {
        if (!Object.is(value1, value2)) {
            difference[context] = { 0: value1, 1: value2 };
        }

        return difference;
    }
    if (type1 === "RegEx") {
        if (value1.toString() !== value2.toString()) {
            difference[context] = { 0: value1, 1: value2 };
        }

        return difference;
    }

    if (type1 === "Date") {
        if (value1.toISOString() !== value2.toISOString()) {
            difference[context] = { 0: value1, 1: value2 };
        }

        return difference;
    }

    // If they are arrays
    if (Array.isArray(value1)) {
        if (value1.length >= value2.length) {
            value1.forEach((arrayItem, index) => {
                const localContext = `${context}[${index}]`;

                if (index < value2.length) {
                    differs(arrayItem, value2[index], difference, localContext);

                } else {
                    difference[localContext] = { 0: arrayItem };
                }
            });

        } else {
            value2.forEach((arrayItem, index) => {
                const localContext = `${context}[${index}]`;

                if (index < value1.length) {
                    differs(value1[index], arrayItem, difference, localContext);

                } else {
                    difference[localContext] = { 1: arrayItem };
                }
            });
        }

        return difference;
    }

    // More to check
    if (value1.constructor === Object) {
        const keys = Object.keys(value1);

        Object.keys(value2).forEach((key) => {
            if (!keys.includes(key))
                keys.push(key);
        });

        keys.forEach((key) => {
            const localContext = `${context}["${key}"]`;

            if (key in value1) {
                if (key in value2) {
                    differs(value1[key], value2[key], difference, localContext);

                } else {
                    difference[localContext] = { 0: value1[key] };
                }

            } else {
                difference[localContext] = { 1: value2[key] };
            }
        });

        return difference;
    }

    // Else
    return difference;
};

module.exports = {
    equals,
    differs,
    sortArrayValues
};