"use strict";

const app = require("../src/equally");

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

const paramsSortTypes = [
    {
        value1 : null,
        value2 : undefined,
        result : -1
    },
    {
        value1 : undefined,
        value2 : null,
        result : 1
    },
    {
        value1 : null,
        value2 : null,
        result : 0
    },
    {
        value1 : undefined,
        value2 : NaN,
        result : -1
    },
    {
        value1 : NaN,
        value2 : undefined,
        result : 1
    },
    {
        value1 : undefined,
        value2 : undefined,
        result : 0
    },
    {
        value1 : Infinity,
        value2 : BigInt(1),
        result : -1
    },
    {
        value1 : BigInt(1),
        value2 : Infinity,
        result : 1
    },
    {
        value1 : Infinity,
        value2 : Infinity,
        result : 0
    },
    {
        value1 : BigInt(1),
        value2 : "text",
        result : -1
    },
    {
        value1 : "text",
        value2 : BigInt(1),
        result : 1
    },
    {
        value1 : BigInt(1),
        value2 : BigInt(1),
        result : 0
    },
    {
        value1 : new Date(), // Date type
        value2 : /.?/, // RegExp type
        result : -1
    },
    {
        value1 : /.?/, // RegExp type
        value2 : new Date("2020-02-02"), // Date type
        result : 1
    },
    {
        value1 : new Date("2020-02-02"), // Date type
        value2 : new Date("2020-02-02"), // RegExp type
        result : 0
    },
    {
        value1 : /.?/, // RegExp type
        value2 : "/.?/", // string type
        result : -1
    },
    {
        value1 : "/.?/", // string type
        value2 : /.?/, // RegExp type
        result : 1
    },
    {
        value1 : /.?/, // RegExp type
        value2 : /.?/, // string type
        result : 0
    }
];

const paramsSortTypesString = [
    {
        value1 : null,
        value2 : "null",
        result : -1
    },
    {
        value1 : "null",
        value2 : null,
        result : 1
    },
    {
        value1 : undefined,
        value2 : "undefined",
        result : -1
    },
    {
        value1 : "undefined",
        value2 : undefined,
        result : 1
    },
    {
        value1 : true,
        value2 : "true",
        result : -1
    },
    {
        value1 : "true",
        value2 : true,
        result : 1
    },
    {
        value1 : NaN,
        value2 : "NaN",
        result : -1
    },
    {
        value1 : "NaN",
        value2 : NaN,
        result : 1
    },
    {
        value1 : Infinity,
        value2 : "Infinity",
        result : -1
    },
    {
        value1 : "Infinity",
        value2 : Infinity,
        result : 1
    },
    {
        value1 : BigInt(1),
        value2 : "1n",
        result : -1
    },
    {
        value1 : "1n",
        value2 : BigInt(1),
        result : 1
    },
    {
        value1 : new Date("2020-02-02"),
        value2 : "2020-02-02T00:00:00.000Z",
        result : -1
    },
    {
        value1 : "2020-02-02T00:00:00.000Z",
        value2 : new Date("2020-02-02"),
        result : 1
    },
    {
        value1 : /.?/,
        value2 : "/.?/",
        result : -1
    },
    {
        value1 : "/.?/",
        value2 : /.?/,
        result : 1
    }
];

const paramsSortSameTypeValues = [
    {
        value1 : true,
        value2 : true,
        result : 0
    },
    {
        value1 : true,
        value2 : false,
        result : 1
    },
    {
        value1 : false,
        value2 : true,
        result : -1
    },
    {
        value1 : NaN,
        value2 : Infinity,
        result : 1
    },
    {
        value1 : NaN,
        value2 : -Infinity,
        result : 1
    },
    {
        value1 : Infinity,
        value2 : -Infinity,
        result : 1
    },
    {
        value1 : BigInt(1),
        value2 : BigInt(2),
        result : -1
    },
    {
        value1 : BigInt(2),
        value2 : BigInt(1),
        result : 1
    },
    {
        value1 : BigInt(1),
        value2 : BigInt(1),
        result : 0
    },
    {
        value1 : new Date("2020-02-02"),
        value2 : new Date("2020-02-03"),
        result : -1
    },
    {
        value1 : new Date("2020-02-03"),
        value2 : new Date("2020-02-02"),
        result : 1
    },
    {
        value1 : new Date("2020-02-03"),
        value2 : new Date("2020-02-03"),
        result : 0
    },
    {
        value1 : /a/,
        value2 : /b/,
        result : -1
    },
    {
        value1 : /b/,
        value2 : /a/,
        result : 1
    },
    {
        value1 : /a/,
        value2 : /a/,
        result : 0
    }
];

const paramsUnorderedArrays = [
    {
        value1      : [1, 2, 3],
        value2      : [2, 3, 1],
        description : "[1, 2, 3] \u2243 [2, 3, 1]",
        result      : true
    },
    {
        value1      : [1, "2", 2],
        value2      : [2, 1, "2"],
        description : "[1, \"2\", 2] \u2243 [2, 1, \"2\"]",
        result      : true
    },
    {
        value1      : [NaN, false, new Date("2020-02-02"), /a/],
        value2      : [/a/, NaN, false, new Date("2020-02-02")],
        description :
      "[NaN, false, new Date(\"2020-02-02\"), /a/] \u2243 [/a/, NaN, false, new Date(\"2020-02-02\")]",
        result: true
    },
    {
        value1      : [Infinity, BigInt(1), "1n", 1.1],
        value2      : [1.1, Number.POSITIVE_INFINITY, "1n", BigInt(1)],
        description :
      "[Infinity, BigInt(1), \"1n\", 1.1] \u2243 [1.1, Number.POSITIVE_INFINITY, \"1n\", BigInt(1)]",
        result: true
    },
    {
        value1      : [null, 1, undefined, "Infinity"],
        value2      : [1, undefined, "Infinity", null],
        description :
      "[null, 1, undefined, \"Infinity\"] \u2243 [1, undefined, \"Infinity\", null]",
        result: true
    },
    {
        value1      : [null, 1, undefined, "Infinity"],
        value2      : ["null", 1, undefined, "Infinity"],
        description :
      "[null, 1, undefined, \"Infinity\"] \u2244 [\"null\", 1, undefined, \"Infinity\"]",
        result: false
    }
];

const paramsConfiguration = [
    {
        value1      : { a: 1, b: [1, 2] },
        value2      : { b: [1, 2], a: 1 },
        options     : {},
        description : "Default configuration",
        result      : true
    },
    {
        value1      : { a: 1, b: [1, 2] },
        value2      : { b: [1, 2], a: 1 },
        options     : { orderedObjectProperties: true },
        description : "Ordered properties",
        result      : false
    },
    {
        value1      : { a: 1, b: [1, 2] },
        value2      : { a: 1, b: [1, 2] },
        options     : { orderedObjectProperties: true },
        description : "Ordered properties",
        result      : true
    },
    {
        value1      : { a: 1, b: [1, 2] },
        value2      : { a: 1, b: [2, 1] },
        options     : { orderedObjectProperties: true },
        description : "Ordered properties",
        result      : false
    },
    {
        value1      : { a: 1, b: [1, 2] },
        value2      : { a: 1, b: [2, 1] },
        options     : { orderedObjectProperties: true, unorderedArrays: true },
        description : "Ordered properties and unordered arrays",
        result      : true
    }
];

const paramsCaseInsensitive = [
    {
        value1      : "Aa",
        value2      : "aa",
        options     : {},
        description : "No case-insensitive",
        result      : false
    },
    {
        value1      : "Aa",
        value2      : "aa",
        options     : { caseInsensitive: true },
        description : "Case-insensitive",
        result      : true
    },
    {
        value1      : { a: "Aa" },
        value2      : { a: "aa" },
        options     : {},
        description : "No case-insensitive (objects)",
        result      : false
    },
    {
        value1      : { a: "Aa" },
        value2      : { a: "aa" },
        options     : { caseInsensitive: true },
        description : "Case-insensitive (objects)",
        result      : true
    },
    {
        value1      : { a: "Aa" },
        value2      : { A: "aa" },
        options     : { caseInsensitive: true },
        description : "Case-insensitive (only for object values)",
        result      : false
    }
];

const paramsDiffersSimpleTypes = [
    {
        value1 : "a",
        value2 : null,
        result : { ".": { 0: "a", 1: null } }
    },
    {
        value1 : "a",
        value2 : "b",
        result : { ".": { 0: "a", 1: "b" } }
    },
    {
        value1 : "a",
        value2 : "a",
        result : {}
    },
    {
        value1 : undefined,
        value2 : null,
        result : { ".": { 0: undefined, 1: null } }
    },
    {
        value1 : undefined,
        value2 : undefined,
        result : {}
    },
    {
        value1 : BigInt(2),
        value2 : BigInt(1),
        result : { ".": { 0: BigInt(2), 1: BigInt(1) } }
    },
    {
        value1 : 1,
        value2 : 1.0,
        result : {}
    }
];

const paramsDiffersComplexTypes = [
    {
        value1 : [1, 2, 3, 4],
        value2 : [1, 3, 3, 5],
        result : {
            ".[1]" : { 0: 2, 1: 3 },
            ".[3]" : { 0: 4, 1: 5 }
        }
    },
    {
        value1 : [1, 2, [3, 4, []], 1.1, 0, 3],
        value2 : [1, 3, [3, 5, [1]], 1.1, undefined],
        result : {
            ".[1]"       : { 0: 2, 1: 3 },
            ".[2][1]"    : { 0: 4, 1: 5 },
            ".[2][2][0]" : { 1: 1 },
            ".[4]"       : { 0: 0, 1: undefined },
            ".[5]"       : { 0: 3, 1: undefined }
        }
    },
    {
        value1 : { a: 1 },
        value2 : { a: 1, b: 1 },
        result : {
            ".[\"b\"]": { 1: 1 }
        }
    },
    {
        value1 : { a: 1, b: 1 },
        value2 : { a: 1 },
        result : {
            ".[\"b\"]": { 0: 1 }
        }
    },
    {
        value1 : { a: 1, b: 2 },
        value2 : { a: 1, b: 1 },
        result : {
            ".[\"b\"]": { 0: 2, 1: 1 }
        }
    },
    {
        value1 : { a: 1, b: 2, c: 3 },
        value2 : { a: 1, b: 1, d: 3 },
        result : {
            ".[\"b\"]" : { 0: 2, 1: 1 },
            ".[\"c\"]" : { 0: 3 },
            ".[\"d\"]" : { 1: 3 }
        }
    },
    {
        value1 : { a: 1, b: { c: 2, d: [3, 4, 5, 6] }, k: undefined },
        value2 : { a: 0, b: { c: 1, d: [3, 3, 5] }, e: 3, k: 666 },
        result : {
            ".[\"a\"]"           : { 0: 1, 1: 0 },
            ".[\"b\"][\"c\"]"    : { 0: 2, 1: 1 },
            ".[\"b\"][\"d\"][1]" : { 0: 4, 1: 3 },
            ".[\"b\"][\"d\"][3]" : { 0: 6 },
            ".[\"e\"]"           : { 1: 3 },
            ".[\"k\"]"           : { 0: undefined, 1: 666 }
        }
    },
    {
        value1 : { a: 1, b: undefined, c: 1 },
        value2 : { a: undefined, b: 1, d: 1 },
        result : {
            ".[\"a\"]" : { 0: 1, 1: undefined },
            ".[\"b\"]" : { 0: undefined, 1: 1 },
            ".[\"c\"]" : { 0: 1 },
            ".[\"d\"]" : { 1: 1 }
        }
    }
];

const displayAsString = value => {
    if (typeof value === "string") {
        return `"${value}"`;
    } else if (typeof value === "bigint") {
        return `${value}n`;
    } else if (
        value !== null &&
    value !== undefined &&
    value.constructor.name === "Date"
    ) {
        return `${value.toISOString()}`;
    }

    return `${value}`;
};

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
            expect(
                app.equals(value1, value2, { orderedObjectProperties: true })
            ).toBe(result);
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

describe("sortArrayValues (order between types)", () => {
    paramsSortTypes.forEach(({ value1, value2, description, result }) => {
        const testDescription = result
            ? description ||
        `${displayAsString(value1)} \u2243 ${displayAsString(value2)}`
            : description ||
        `${displayAsString(value1)} \u2244 ${displayAsString(value2)}`;

        test(testDescription, () => {
            expect(app.sortArrayValues(value1, value2)).toBe(result);
        });
    });
});

describe("sortArrayValues (order of types and strings)", () => {
    paramsSortTypesString.forEach(({ value1, value2, description, result }) => {
        const testDescription = result
            ? description ||
        `${displayAsString(value1)} \u2243 ${displayAsString(value2)}`
            : description ||
        `${displayAsString(value1)} \u2244 ${displayAsString(value2)}`;

        test(testDescription, () => {
            expect(app.sortArrayValues(value1, value2)).toBe(result);
        });
    });
});

describe("sortArrayValues (order of values of the same type)", () => {
    paramsSortSameTypeValues.forEach(
        ({ value1, value2, description, result }) => {
            const testDescription = result
                ? description ||
          `${displayAsString(value1)} \u2243 ${displayAsString(value2)}`
                : description ||
          `${displayAsString(value1)} \u2244 ${displayAsString(value2)}`;

            test(testDescription, () => {
                expect(app.sortArrayValues(value1, value2)).toBe(result);
            });
        }
    );
});

describe("sortArrayValues (unordered)", () => {
    paramsUnorderedArrays.forEach(({ value1, value2, description, result }) => {
        const testDescription = result
            ? description ||
        `${displayAsString(value1)} \u2243 ${displayAsString(value2)}`
            : description ||
        `${displayAsString(value1)} \u2244 ${displayAsString(value2)}`;

        test(testDescription, () => {
            expect(app.equals(value1, value2, { unorderedArrays: true })).toBe(
                result
            );
        });
    });
});

describe("equals (several configuration values)", () => {
    paramsConfiguration.forEach(
        ({ value1, value2, options, description, result }) => {
            const testDescription = result
                ? `${description}: ${JSON.stringify(value1)} = ${JSON.stringify(
                    value2
                )}`
                : `${description}: ${JSON.stringify(value1)} \u2260 ${JSON.stringify(
                    value2
                )}`;

            test(testDescription, () => {
                expect(app.equals(value1, value2, options)).toBe(result);
            });
        }
    );
});

describe("equals (string case-insensitive)", () => {
    paramsCaseInsensitive.forEach(
        ({ value1, value2, options, description, result }) => {
            const testDescription = result
                ? `${description}: ${JSON.stringify(value1)} \u2243 ${JSON.stringify(
                    value2
                )}`
                : `${description}: ${JSON.stringify(value1)} \u2244 ${JSON.stringify(
                    value2
                )}`;

            test(testDescription, () => {
                expect(app.equals(value1, value2, options)).toBe(result);
            });
        }
    );
});

describe("differs (simple types)", () => {
    paramsDiffersSimpleTypes.forEach(({ value1, value2, result }) => {
        const testDescription = app.equals(result, {})
            ? `${value1} = ${value2}`
            : `${value1} \u2260 ${value2}`;

        test(testDescription, () => {
            expect(app.differs(value1, value2)).toEqual(result);
        });
    });
});

describe("differs (complex types)", () => {
    paramsDiffersComplexTypes.forEach(({ value1, value2, result }) => {
        const testDescription = app.equals(result, {})
            ? `${JSON.stringify(value1)} = ${JSON.stringify(value2)}`
            : `${JSON.stringify(value1)} \u2260 ${JSON.stringify(value2)}`;

        test(testDescription, () => {
            const actual = app.differs(value1, value2);
            // TODO: do not compare the whole result but key by key
            expect(actual).toEqual(result);
        });
    });
});
