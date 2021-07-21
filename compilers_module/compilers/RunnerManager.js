const path = require('path');
const FileHelper = require('../helpers/FileHelper');
// const CRunner = require('./CRunner');
// const CppRunner = require('./CppRunner');
// const JavaRunner = require('./JavaRunner');
const JavaScriptRunner = require('./JavaScriptRunner');
// const PythonRunner = require('./PythonRunner');
const UserProgress = require('../../models/userProgress.model');
const bcrypt = require('bcryptjs');


function Factory() {
  this.createRunner = function createRunner(lang) {
    let runner;

    if (lang === 'javascript') {
      runner = new JavaScriptRunner();
      // } else if (lang === 'c++') {
      //   runner = new CppRunner();
      // } else if (lang === 'java') {
      //   runner = new JavaRunner();
      // } else if (lang === 'c') {
      //   runner = new CRunner();
      // } else if (lang === 'python') {
      //   runner = new PythonRunner();
    }

    return runner;
  };
}

module.exports = {
  run(lang, name, code, res) {
    const factory = new Factory();
    const runner = factory.createRunner(lang.toLowerCase());

    const directory = path.join(__dirname, '../lessons', name, Date.now() + '-temp');
    const file = path.join(directory, runner.defaultFile());
    const filename = path.parse(file).name; // Temp
    const extension = path.parse(file).ext; // .js

    FileHelper.saveFile(file, code, () => {
      runner.run(file, directory, filename, extension, (passed, testMessage, status, runMessage) => {

        let message = "";
        if (status != 0) {
          let tempMessage = "Oh snap ! You got an error!\n" + runMessage;
          runMessage = tempMessage;
        }
        if (!passed) {
          message += "success";
          const result = {
            message, passed, testMessage, status, runMessage
          };
          res.end(JSON.stringify(result));
        }
        else {
          testMessage += "TEST PASSED";
          UserProgress.findOne({ user: res.locals.user.sub, course: res.req.body.course }, function (err, userProgress) {
            if (err) {
              passed = false;
              message += "Error when saving user progress. " + err;
              const result = {
                message, passed, testMessage, status, runMessage
              };
              res.end(JSON.stringify(result));
            }
            else {
              if (!userProgress) {
                passed = false;
                message += "Error when saving user progress. No user progress was found";
                const result = {
                  message, passed, testMessage, status, runMessage
                };
                res.end(JSON.stringify(result));
              }
              else {
                const sectionIndex = userProgress.progresses.findIndex((element) => element.section == res.req.body.section);
                if (!userProgress.progresses[sectionIndex].passedLessons.includes(res.req.body.lesson)) {
                  userProgress.progresses[sectionIndex].passedLessons.push(res.req.body.lesson);
                  userProgress.save(function (err) {
                    if (err) {
                      passed = false;
                      message += "Error when saving user progress. " + err;
                      const result = {
                        message, passed, testMessage, status, runMessage
                      };
                      res.end(JSON.stringify(result));
                    }
                    else {
                      message = "success";
                      const result = {
                        message, passed, testMessage, status, runMessage
                      };
                      res.end(JSON.stringify(result));
                    }
                  })
                }
                else {
                  message = "success";
                  const result = {
                    message, passed, testMessage, status, runMessage
                  };
                  res.end(JSON.stringify(result));
                }
              }
            }
          })
        }
      });
    });
  },
};