var assert = require('chai').assert;
const AssertionError = require('assert').AssertionError;
const fs = require('fs');
const path = require('path');

let codeDirectory = process.argv[2];


fs.readFile(`${__dirname}/${codeDirectory}/Temp.js`, 'utf8', function (err, code) {
    if (err) {
        return console.log(err);
    }

    try {
        eval(code + `\nassert.strictEqual(Array.isArray(yourArray), true,"yourArray should be an array.");`);
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
        eval(code + `\nassert.isAtLeast(yourArray.length, 5, "yourArray should be at least 5 elements long.");`);
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
        eval(code + `\nassert(yourArray.filter((el) => typeof el === 'boolean').length >= 1, "yourArray should contain at least one boolean");`);
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
        eval(code + `\nassert(yourArray.filter((el) => typeof el === 'number').length >= 1, "yourArray should contain at least one number");`);
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
        eval(code + `\nassert(yourArray.filter((el) => typeof el === 'string').length >= 1, "yourArray should contain at least one string");`);
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
