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
        assert(!(/var/g).test(code),"var should not exist in the code.");
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
        assert(code.match(/(const SENTENCE)/g),"The variable i declared in the if statement should equal the string block scope.");
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
        assert(code.match(/(let i)/g),"i should be declared with let.");
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
        assert(code.match(/console\.log\(\s*SENTENCE\s*\)\s*;?/g),"console.log should be changed to print the SENTENCE variable.");
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
