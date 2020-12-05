const uploadFile = require("../helpers/upload");
const Resource = require('../models/resource.model')
const path = require('path');
const fs = require('fs');

const resourcesDir = "/resources/";
const __basedir = path.resolve();
const baseUrl = "http://localhost:3000/api/file/";

exports.upload = (req, res) => {
    fs.mkdir(path.resolve(resourcesDir.replace("/", ""), req.params.section_id), { recursive: true }, e => {
      if (e) {
        console.error(e);
      } 
      else {
        uploadFile(req, res)
        .then(() => {
          if (req.file == undefined) {
            return res.status(400).send({ message: "Please upload a file!" });
          }
          //Need to check if file exists (not coded yet) and send message
          return res.status(200).send({
            message: "success"
          });
        })
        .catch((err) => {
          if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(500).send({
              message: "File size cannot be larger than 20MB!",
            });
          }
      
          return res.status(500).send({
            message: `Could not upload the file: ${err}`,
          });
        })
      }
    });
};

exports.getListFiles = (req, res) => {
  const directoryPath = __basedir + resourcesDir + req.params.section_id;

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: "http://localhost:3000/api/file/" + req.params.section_id + "/" + file,
      });
    });

    res.status(200).json({message: "success", data: fileInfos});
  });
};

exports.download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + resourcesDir + req.params.section_id + "/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

exports.delete = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + resourcesDir + req.params.section_id + "/";

  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    }
    else {
      return res.status(200).json({message: "success"})
    }
  });
  //Need to delete folder when folder is empty
};
