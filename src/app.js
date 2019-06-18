const isDef = (value) => value !== null && value !== undefined;

const anyUndef = (... values) => !values.every(value => isDef(value));

// same own properties, same values, any order
const equalObjects = (obj1, obj2) => {
    const keys1 = Object.keys(obj1).sort();

    if (!equalArrays(keys1, Object.keys(obj2).sort())) {
        return false;
    } 

    for (let i = 0; i < keys1.length; i += 1) {
        if (!equals(obj1[keys1[i]], obj2[keys1[i]])) {
            return false;
        }
    }

    return true;
};

// same length, same values, same order
const equalArrays = (array1, array2) => {
    const length1 = array1.length;

    if (length1 !== array2.length) {
        return false;
    }

    for (let i = 0; i < length1; i += 1) {
        if (!equals(array1[i], array2[i])) {
            return false;
        }
    }

    return true;
};

const equals = (value1, value2) => {
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
        return value1.getTime() === value2.getTime();
    }

    if (value1.constructor === RegExp && value2.constructor === RegExp) {
        return value1.toString() === value2.toString();
    }

    // If both are objects, they have a special treatment
    if (value1.constructor === Object && value2.constructor === Object) {
        return equalObjects(value1, value2);
    }

    // If both are arrays, they have a special treatment
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
    if (Array.isArray(value1) && Array.isArray(value2)) {
        return equalArrays(value1, value2);
    }
    
    return false;
};

module.exports = { equals };