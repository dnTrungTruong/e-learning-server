var assert = require("assert");
const AssertionError = require('assert').AssertionError;
const fs = require('fs');
const path = require('path');

let codeDirectory = process.argv[2];


fs.readFile(`${__dirname}/${codeDirectory}/Temp.js`, 'utf8', function (err,code) {
    if (err) {
      return console.log(err);
    }

    try {
        eval(code + `\nassert.strictEqual(myArray[0], 'a', "myArray[0] should be equal to the letter a");`);
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
        eval(code + `\nassert.notStrictEqual(myArray[1], 'b', "myArray[1] should not be equal to the letter b");`);
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
        eval(code + `\nassert.strictEqual(myArray[2], 'c', "myArray[2] should be equal to the letter c");`);
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
        eval(code + `\nassert.strictEqual(myArray[3], 'd', "myArray[3] should be equal to the letter d");`);
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
