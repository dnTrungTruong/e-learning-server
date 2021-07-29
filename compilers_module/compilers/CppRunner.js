const { spawn } = require('child_process');
const Runner = require('./Runner');
const path = require('path');
 
class CRunner extends Runner {
  defaultFile() {
    return this.defaultfile;
  }
 
  constructor() {
    super();
    this.defaultfile = 'Temp.cpp';
  }
 
  run(file, directory, filename, extension, callback) {
    if (extension.toLowerCase() !== '.c') {
      console.log(`${file} is not a c file.`);
      return;
    }
    this.compile(file, directory, filename, callback);
  }
 
  
 
  
  async execute(file, directory, filename, extension, callback) {
    let passed = false;
    let testMessage = "";
    let status = '1';
    let runMessage = "";
    try {

      let containerName = Date.now();
      let dockerImage = "cpp-runner";
      let lessonPath = path.join(directory, '../');
      let userDirectory = path.basename(directory);
      let executeCmd = `/bin/sh -c "g++ -Wall Temp.cpp -o a && ./a >&1 | tee"`

      let runCommand = "docker run -m 64M --memory-swap 64M --name " + containerName + " -v "
        + lessonPath + ":/code -w/code " + dockerImage + executeCmd;
      let runOptions = { timeout: 7000, killSignal: 'SIGKILL' }; //Start a container might take a long time
      const run = await execShellCommand(runCommand, runOptions, containerName);
      runOptions = { timeout: 5000, killSignal: 'SIGKILL' };

      if (run) {
        //TODO: Implement test
        passed = true;
        runMessage = run;
      }
      else {
        runMessage = "ERROR TO START COMPILER";
      }

      fs.rmdir(directory, { recursive: true }, () => {
        callback(passed, testMessage, status, runMessage);
      });

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
 
module.exports = CRunner;