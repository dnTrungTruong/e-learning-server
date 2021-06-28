var assert = require("assert");
const AssertionError = require('assert').AssertionError;
const fs = require('fs');

let codeDirectory = process.argv[2];


fs.readFile(`${__dirname}/${codeDirectory}/Temp.js`, 'utf8', function (err, code) {
    if (err) {
        return console.log(err);
    }
    try {
        assert(code.match(/(\/\/)...../g), "You should create a // style comment that contains at least five letters.        ");
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
        assert(code.match(/(\/\*)([^\/]{5,})(?=\*\/)/gm), "You should create a /* */ style comment that contains at least five letters.");
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
