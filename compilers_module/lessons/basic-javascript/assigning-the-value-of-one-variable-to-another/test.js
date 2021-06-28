var assert = require("assert");
const AssertionError = require('assert').AssertionError;
const fs = require('fs');

let codeDirectory = process.argv[2];

fs.readFile(`${__dirname}/${codeDirectory}/Temp.js`, 'utf8', function (err,code) {
    if (err) {
      return console.log(err);
    }

    try {
        eval(code + `\nassert(/var a;/.test(code) && /a = 7;/.test(code) && /var b;/.test(code), "You should not change code above the specified comment.");`);
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
        eval(code + `\nassert(typeof b === 'number' && b === 7, "b should have a value of 7.");`);
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
        assert(/b\s*=\s*a\s*/g.test(code), "a should be assigned to b with =");
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