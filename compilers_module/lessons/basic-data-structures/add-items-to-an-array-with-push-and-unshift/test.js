var assert = require("assert");
const AssertionError = require('assert').AssertionError;
const fs = require('fs');
const path = require('path');

let codeDirectory = process.argv[2];


fs.readFile(`${__dirname}/${codeDirectory}/Temp.js`, 'utf8', function (err, code) {
    if (err) {
        return console.log(err);
    }

    try {
        // assert.deepStrictEqual(['IV', 5, 'six'], [ 'I', 2, 'three', 'IV', 5, 'six', 7, 'VIII', 9 ], "loi");
        eval(code + `\nassert.deepStrictEqual(mixedNumbers(['IV', 5, 'six']), [ 'I', 2, 'three', 'IV', 5, 'six', 7, 'VIII', 9 ], 'mixedNumbers(["IV", 5, "six"]) should now return ["I", 2, "three", "IV", 5, "six", 7, "VIII", 9]');`);
    }
    catch (e) {
        if ((e instanceof AssertionError) || (e.constructor.name == "AssertionError")) {
            console.log("A TEST FAILED: " + e.message);
        }
        else {
            console.log("A TEST FAILED TO EXECUTE DUE TO ERROR");
        }
    }

    try {
        eval(code + `\nassert(mixedNumbers.toString().match(/\.push/), "The mixedNumbers function should utilize the push() method");`);
    }
    catch (e) {
        if ((e instanceof AssertionError) || (e.constructor.name == "AssertionError")) {
            console.log("A TEST FAILED: " + e.message);
        }
        else {
            console.log("A TEST FAILED TO EXECUTE DUE TO ERROR");
        }
    }

    try {
        eval(code + `\nassert(mixedNumbers.toString().match(/\.unshift/), "The mixedNumbers function should utilize the unshift() method");`);
    }
    catch (e) {
        if ((e instanceof AssertionError) || (e.constructor.name == "AssertionError")) {
            console.log("A TEST FAILED: " + e.message);
        }
        else {
            console.log("A TEST FAILED TO EXECUTE DUE TO ERROR");
        }
    }

});
