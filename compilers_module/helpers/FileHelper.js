const mkdirp = require('mkdirp');
const fs = require('fs');
const getDirName = require('path').dirname;
const path = require('path');

module.exports = {
    getFile(name, callback) {
    // getFile(lang, callback) {
      let file = '';
      // const language = lang.toLowerCase();
      // if (language === 'java') {
      //   file = path.join(__dirname, '../templates', 'Hello.java');
      // } else if (language === 'c') {
      //   file = path.join(__dirname, '../templates', 'Hello.c');
      // } else if (language === 'c++') {
      //   file = path.join(__dirname, '../templates', 'Hello.cpp');
      // } else if (language === 'javascript') {
      //   file = path.join(__dirname, '../templates', 'Hello.js');
      // } else if (language === 'python') {
      //   file = path.join(__dirname, '../templates', 'Hello.py');
      // } else {
      //   callback('');
      //   return;
      // }
      file = path.join(__dirname, '../lessons', name, 'template.js');
      console.log(`getTemplate:${file}`);
      fs.readFile(file, (err, data) => {
        if (err) {
          console.log(err);
          return callback("error");
        }
        if (data) return callback(data.toString());
      });
    },
   
    saveFile(file, code, callback) {
      // create parent directories if they doesn't exist.
      mkdirp(getDirName(file)).then((made) => {
        console.log("created folder");
        return fs.writeFile(file, code, (err2) => {
          if (err2) {
              console.log(err2);
            throw err2;
          }
          console.log("created file");
   
          callback();
        });
      }).catch((err) => {
        return callback(err);
      })
    },
  };