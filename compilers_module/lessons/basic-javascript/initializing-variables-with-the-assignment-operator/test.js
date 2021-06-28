var assert = require("assert");
const AssertionError = require('assert').AssertionError;
const fs = require('fs');

let codeDirectory = process.argv[2];

fs.readFile(`${__dirname}/${codeDirectory}/Temp.js`, 'utf8', function (err,code) {
    if (err) {
      return console.log(err);
    }

    try {
        assert(/var\s+a\s*=\s*9(\s*;?\s*)$/.test(code), "You should initialize a to a value of 9.");
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