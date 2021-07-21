const express = require('express')
const app = express()

const FileHelper = require('./helpers/FileHelper');
const RunnerManager = require('./compilers/RunnerManager');
const Authorization = require('../helpers/authorization'); 
const router = express.Router();

router.get('/get-template', (req, res) => {
  // const language = req.params.lang;
  const challengeName = req.query.name;
  FileHelper.getFile(challengeName, (content) => {
    if (content == "error") {
      const response = {
        message: "error",
        name: challengeName,
        code: "",
      };
      res.status(200).send(JSON.stringify(response));
    }
    else {
      const response = {
        message: "success",
        name: challengeName,
        code: content,
      };
      res.status(200).send(JSON.stringify(response));
    }
    
  });
});
 
router.post('/run', Authorization.authorize(), (req, res) => {
  const file = req.body;
  RunnerManager.run(file.lang, file.name, file.code, res);
});

module.exports = router