const { spawn, exec } = require('child_process');
const Runner = require('./Runner');
const path = require('path');
const fs = require('fs');
class JavaScriptRunner extends Runner {
  defaultFile() {
    return this.defaultfile;
  }

  constructor() {
    super();
    this.defaultfile = 'Temp.js';
  }

  run(file, directory, filename, extension, callback) {
    if (extension.toLowerCase() !== '.js') {
      console.log(`${file} is not a javascript file.`);
    }
    this.execute(file, directory, filename, extension, callback);
  }

  async execute(file, directory, filename, extension, callback) {
    let passed = false;
    let testMessage = "";
    let status = '1';
    let runMessage = "";
    try {

      let containerName = Date.now();
      let dockerImage = "javascript-runner";
      let lessonPath = path.join(directory, '../');
      let userDirectory = path.basename(directory);

      let runCommand = "docker run -m 64M --memory-swap 64M -d -t --name " + containerName + " -v "
        + lessonPath + ":/code " + dockerImage;
      let runOptions = { timeout: 7000, killSignal: 'SIGKILL' }; //Start a container might take a long time
      const run = await execShellCommand(runCommand, runOptions, containerName);
      runOptions = { timeout: 5000, killSignal: 'SIGKILL' };

      if (run) {
        let testCommand = "docker exec -i " + containerName + " node /code/test.js " + userDirectory;
        const test = await execShellCommand(testCommand, runOptions, containerName);

        if (test.includes("A TEST FAILED") || test.startsWith("\nerror") || test.startsWith("\nERROR") || 
        test.startsWith("\n/code/") || test.startsWith("\nTimeout")) {
          testMessage = test;
        }
        else {
          passed = true;
        }

        let executeCodeCommand = "docker exec " + containerName + " node /code/" + userDirectory + "/Temp.js";
        const executeCode = await execShellCommand(executeCodeCommand, runOptions, containerName);
      
        if (executeCode) {
          if (executeCode.startsWith("\nerror") || executeCode.startsWith("\nERROR") || 
          executeCode.startsWith("\n/code/") || executeCode.startsWith("\nTimeout")) {
            status = "2";
          }
          else {
            status = "0";
          }
          if (executeCode == "\n") {
            runMessage = "*** NO OUTPUT ***"
          }
          else {
            runMessage = executeCode;
          }
        }
        else {
          status = '0';
          runMessage = "*** NO OUTPUT ***"
        }
      }
      else {
        runMessage = "ERROR TO START COMPILER";
      }

      fs.rmdir(directory, { recursive: true }, () => {
        callback(passed, testMessage, status, runMessage);
      });

      let removeCommand = "docker rm -f " + containerName;
      execShellCommand(removeCommand);
    }
    catch (err) {
      console.log("CATCH ERROR");
      fs.rmdir(directory, { recursive: true }, () => {
        runMessage += err.message;
        callback(passed, testMessage, status, runMessage);
      });
    }


  }

  log(message) {
    console.log(message);
  }
}


function execShellCommand(cmd, options = {}, containerName) {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (error, stdout, stderr) => {
      if (error) {
        if (error.killed) { // timeout
          resolve(stdout + `\nTimeout after 5000ms`);
        } else {
          console.log(error.message);
          if (error.message.startsWith("Command failed: docker")) {
            let start = error.message.indexOf('\n', 2);
            resolve(error.message.substring(start));
          }
          else {
            resolve(error.message);
          }
        }
      }
      if (stdout) {
        resolve(stdout);
      }
      else {
        //stderr
        if (stderr.startsWith("docker: Error response from daemon: OCI runtime"))
          resolve("Out of Memory 64MB");
        else {
          resolve(stderr); // 2, execution failure
        }
      }
    });
  });
}

module.exports = JavaScriptRunner;