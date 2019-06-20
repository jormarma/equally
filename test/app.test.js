const app = require("../src/app");

const paramsBasicTypes = [
    {
        value1 : null,
        value2 : null,
        result : true
    },
    {
        value1 : undefined,
        value2 : undefined,
        result : true
    },
    {
        value1 : NaN,
        value2 : NaN,
        result : true
    },
    {
        value1 : Infinity,
        value2 : Infinity,
        result : true
    },
    {
        value1      : Infinity,
        value2      : Number.POSITIVE_INFINITY,
        result      : true,
        description : "Infinity = Number.POSITIVE_INFINITY"
    },
    {
        value1      : Infinity,
        value2      : Number.NEGATIVE_INFINITY,
        result      : false,
        description : "Infinity \u2260 Number.NEGATIVE_INFINITY"
    },
    {
        value1      : -0,
        value2      : 0,
        result      : false,
        description : "-0 \u2260 0"
    },
    {
        value1 : /.?/,
        value2 : /.?/,
        result : true
    },
    {
        value1 : /.?/,
        value2 : /.?/g,
        result : false
    },
    {
        value1 : new Date("2020-02-02"),
        value2 : new Date("2020-02-02"),
        result : true
    },
    {
        value1 : new Date("2020-02-03"),
        value2 : new Date("2020-02-02"),
        result : false
    },
    {
        value1 : () => {},
        value2 : () => {},
        result : false
    },
    {
        value1 : null,
        value2 : undefined,
        result : false
    },
    {
        value1 : null,
        value2 : NaN,
        result : false
    },
    {
        value1 : BigInt(1),
        value2 : BigInt("1"),
        result : true
    },
    {
        value1      : null,
        value2      : {},
        result      : false,
        description : "null \u2260 {}"
    },
    {
        value1      : null,
        value2      : [],
        result      : false,
        description : "null \u2260 []"
    },
    {
        value1      : null,
        value2      : "",
        result      : false,
        description : "null \u2260 \"\""
    },
    {
        value1 : null,
        value2 : () => {},
        result : false
    }
];

const paramsObjects = [
    {
        value1 : {},
        value2 : { a: 1 },
        result : false
    },
    {
        value1 : { a: 1 },
        value2 : { a: 2 },
        result : false
    },
    {
        value1 : { a: 1 },
        value2 : { b: 1 },
        result : false
    },
    {
        value1 : { a: 1, b: 1 },
        value2 : { b: 1, a: 1 },
        result : true
    },
    {
        value1 : { a: 1, b: { c: 1, d: 1 } },
        value2 : { b: { d: 1, c: 1 }, a: 1 },
        result : true
    },
    {
        value1 : { a: 1 },
        value2 : [1],
        result : false
    }
];

const paramsObjectsWithOrderedProperties = [
    {
        value1 : { a: 1, b: 1 },
        value2 : { b: 1, a: 1 },
        result : false
    },
    {
        value1 : { a: 1, b: 1 },
        value2 : { a: 1, b: 1 },
        result : true
    },
    {
        value1 : { a: 1, b: { c: 1, d: 1 } },
        value2 : { a: 1, b: { d: 1, c: 1 } },
        result : false
    },
    {
        value1 : { a: 1, b: { c: 1, d: 1 } },
        value2 : { a: 1, b: { c: 1, d: 1 } },
        result : true
    }
];

const paramsArrays = [
    {
        value1 : [1, 2],
        value2 : [2, 1],
        result : false
    },
    {
        value1 : [1, 2],
        value2 : [1],
        result : false
    },
    {
        value1 : [1, 2],
        value2 : [1, 2],
        result : true
    }
];

const paramsComplex = [
    {
        value1: { 
            a : new Date("2020-02-02"), 
            b : { 
                c : 1, 
                d : 1 
            } 
        },
        value2: { 
            a : new Date("2020-02-03"), 
            b : { 
                c : 1, 
                d : 1 
            } 
        },
        result: false
    },
    {
        value1: { 
            a : new Date("2020-02-02"), 
            b : { 
                c : null, 
                d : 1 
            } 
        },
        value2: { 
            a : new Date("2020-02-02"), 
            b : { 
                d : -1, 
                c : null 
            } 
        },
        result: false
    },
    {
        value1: { 
            a : new Date("2020-02-02"), 
            b : { 
                c : null, 
                d : [{}, { n: 1 }] 
            } 
        },
        value2: { 
            a : new Date("2020-02-02"), 
            b : { 
                d : [{}, { n: 2 }], 
                c : null 
            } 
        },
        result: false
    },
    {
        value1: { 
            a : new Date("2020-02-02"), 
            b : { 
                c : null, 
                d : [{}, { n: 1 }] 
            } 
        },
        value2: { 
            b: { 
                d : [{}, { n: 1 }], 
                c : null 
            },
            a: new Date("2020-02-02")
        },
        result: true
    }
];


describe("equals (basic types)", () => {
    paramsBasicTypes.forEach(({ value1, value2, result, description }) => {
        const testDescription = result
            ? description || `${value1} = ${value2}`
            : description || `${value1} \u2260 ${value2}`;
            
        test(testDescription, () => {
            expect(app.equals(value1, value2)).toBe(result);
        });
    });
});

describe("equals (objects)", () => {
    paramsObjects.forEach(({ value1, value2, result }) => {
        const val1 = JSON.stringify(value1);
        const val2 = JSON.stringify(value2);

        const testDescription = result
            ? `${val1} = ${val2}`
            : `${val1} \u2260 ${val2}`;
            
        test(testDescription, () => {
            expect(app.equals(value1, value2)).toBe(result);
        });
    });
});

describe("equals (objects with ordered properties)", () => {
    paramsObjectsWithOrderedProperties.forEach(({ value1, value2, result }) => {
        const val1 = JSON.stringify(value1);
        const val2 = JSON.stringify(value2);

        const testDescription = result
            ? `${val1} = ${val2}`
            : `${val1} \u2260 ${val2}`;
            
        test(testDescription, () => {
            expect(app.equals(value1, value2, { orderedObjectProperties: true })).toBe(result);
        });
    });
});

describe("equals (arrays)", () => {
    paramsArrays.forEach(({ value1, value2, result }) => {
        const val1 = JSON.stringify(value1);
        const val2 = JSON.stringify(value2);

        const testDescription = result
            ? `${val1} = ${val2}`
            : `${val1} \u2260 ${val2}`;
            
        test(testDescription, () => {
            expect(app.equals(value1, value2)).toBe(result);
        });
    });
});

describe("equals (complex values)", () => {
    paramsComplex.forEach(({ value1, value2, result }) => {
        const val1 = JSON.stringify(value1);
        const val2 = JSON.stringify(value2);

        const testDescription = result
            ? `${val1} = ${val2}`
            : `${val1} \u2260 ${val2}`;
            
        test(testDescription, () => {
            expect(app.equals(value1, value2)).toBe(result);
        });
    });
});