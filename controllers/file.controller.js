const upload = require("../helpers/upload");
const Resource = require('../models/resource.model')
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const config = require('../config.json')

const resourcesDir = "/resources/";
const __basedir = path.resolve();
const baseUrl = "http://localhost:3000/api/file/";


exports.uploadImage = (req, res) => {
  fs.mkdir(__basedir + "/temp/", { recursive: true }, err => {
    if (err) {
      return res.status(500).json({message: err.message})
    } 
    else {
      upload.uploadImage(req, res)
      .then(() => {
        if (req.file == undefined) {
          return res.status(400).send({ message: "Please upload a image!" });
        }
        cloudinary.config({
          cloud_name: config.CLOUD_NAME,
          api_key: config.CLOUDINARY_API_KEY,
          api_secret: config.CLOUDINARY_API_SECRET
        });

        const path = req.file.path;

        cloudinary.uploader.upload(
          path,
          { folder: `course_image/`, tags: `courseimage` }, 
          function (err, image) {
              if (err) return res.json({message: err});
              // remove file from server, log if failed deleting
              fs.unlink(path, function (err) {
                if (err) {
                  console.log(err)
                }
              });
              // return image details
              //below are respond from cloudinary
            //   {
            //     "message": "success",
            //     "data": {
            //         "asset_id": "8abdf93aa85fe6308c0a98d227af99f9",
            //         "public_id": "course_image/ttuofo6jfxst4t82lbw7",
            //         "version": 1607394408,
            //         "version_id": "50b25c8eb39237050b332cedaa5d11dd",
            //         "signature": "5a08818736fa96694a6d9eb1f7039440963b5fc6",
            //         "width": 241,
            //         "height": 145,
            //         "format": "jpg",
            //         "resource_type": "image",
            //         "created_at": "2020-12-08T02:26:48Z",
            //         "tags": [
            //             "courseimage"
            //         ],
            //         "bytes": 18813,
            //         "type": "upload",
            //         "etag": "6e95880b31a524d2bed25ac36eda8d43",
            //         "placeholder": false,
            //         "url": "http://res.cloudinary.com/ducnguyen14665/image/upload/v1607394408/course_image/ttuofo6jfxst4t82lbw7.jpg",
            //         "secure_url": "https://res.cloudinary.com/ducnguyen14665/image/upload/v1607394408/course_image/ttuofo6jfxst4t82lbw7.jpg",
            //         "original_filename": "1607394407183",
            //         "original_extension": "JPG"
            //     }
            // }
              return res.status(200).json({message: "success", data: image.secure_url});
          }
      )
        //Need to check if file exists (not coded yet) and send message
        // return res.status(200).send({
        //   message: "success"
        // });
      })
      .catch((err) => {
        return res.status(500).send({
          message: `Could not upload the file: ${err}`,
        });
      })
    }
  });
}

exports.uploadDoc = (req, res) => {
    fs.mkdir(path.resolve(resourcesDir.replace("/", ""), req.params.section_id), { recursive: true }, err => {
      if (err) {
        return res.status(500).json({message: err.message})
      } 
      else {
        upload.uploadDoc(req, res)
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
