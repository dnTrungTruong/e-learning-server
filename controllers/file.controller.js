const upload = require("../helpers/upload");
const Resource = require('../models/resource.model')
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const config = require('../config.json')
const s3 = require('../helpers/s3')

const resourcesDir = "/resources/";
const __basedir = path.resolve();
const baseUrl = "http://localhost:3000/api/file/";
const awsS3Url = "https://e-learning-10r825s36vuq028g5csk.s3.amazonaws.com/";


exports.uploadImage = (req, res) => {
  upload.uploadImage(req, res)
      .then(() => {
        if (req.file == undefined) {
          return res.status(200).json({ message: "Please upload a image!" });
        }
        //reponse image url
        return res.status(200).json({ message: "success", data: req.file.location });
      })
      .catch((err) => {
        return res.status(200).json({
          message: `Could not upload the file: ${err}`,
        });
      })
}

// exports.deleteImage = (req, res) => {
//   cloudinary.config({
//     cloud_name: config.CLOUD_NAME,
//     api_key: config.CLOUDINARY_API_KEY,
//     api_secret: config.CLOUDINARY_API_SECRET
//   });
//   cloudinary.uploader.destroy(req.body.public_id, function(err, result) {
//      if (err) {
//        return res.status(200).json({message: err});
//      }
//      else {
//        return res.status(200).json({message: "success"});
//      }
//     });
// }

//AWS S3
exports.upload = (req, res) => {
  upload.upload(req, res)
  .then(() => {
    if (req.file == undefined) {
      return res.status(200).send({ message: "Please upload a file!" });
    }
    return res.status(200).json({
      message: "success"
    });
  })
  .catch((err) => {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(200).send({
        message: "File size cannot be larger than 20MB!",
      });
    }

    return res.status(200).send({
      message: `Could not upload the file: ${err}`,
    });
  });
}

exports.uploadVideo = (req, res) => {
  var fileurls = [];

  const fileName = "course_videos/" + req.params.section_id + "/" + Date.now() + "-" + req.query.fileName;
    const params = {
        Bucket: config.AWS_BUCKET_NAME,
        Key: fileName,
        Expires: 60 * 60, // Time untill presigned URL is valid
        ACL: 'public-read',
        ContentType: req.query.fileType
    };

    s3.getSignedUrl('putObject', params, function async(err, url) {
        if (err) {
            return res.status(200).json({
                message: err
            });
        }
        else {
            fileurls[0] = url;
            fileurls[1] = awsS3Url + encodeURI(fileName);
            return res.status(200).json({  message: 'success', data: fileurls });
        }
    });
}

exports.uploadDoc = (req, res) => {
    fs.mkdir(path.resolve(resourcesDir.replace("/", ""), req.params.section_id), { recursive: true }, err => {
      if (err) {
        return res.status(200).json({message: err.message})
      } 
      else {
        upload.uploadDoc(req, res)
        .then(() => {
          if (req.file == undefined) {
            return res.status(200).send({ message: "Please upload a file!" });
          }
          //Need to check if file exists (not coded yet) and send message
          return res.status(200).send({
            message: "success"
          });
        })
        .catch((err) => {
          if (err.code == "LIMIT_FILE_SIZE") {
            return res.status(200).send({
              message: "File size cannot be larger than 20MB!",
            });
          }
      
          return res.status(200).send({
            message: `Could not upload the file: ${err}`,
          });
        })
      }
    });
};

exports.getListFiles = (req, res) => {
  const params = {
    Bucket: config.AWS_BUCKET_NAME,
    Prefix: "course_resources/" + req.params.section_id + '/'
  }
 
  var keys = [];
  s3.listObjectsV2(params, (err, data) => {
        if (err) {
        res.status(200).json({message: err.message});
        } else {
            var contents = data.Contents;
            contents.forEach(function (content) {
                keys.push(content.Key);
        });
        res.status(200).json({message: "sucess", data: keys});
    }
  });
  // const directoryPath = __basedir + resourcesDir + req.params.section_id;

  // fs.readdir(directoryPath, function (err, files) {
  //   if (err) {
  //     return res.status(200).send({
  //       message: "Unable to scan files!",
  //     });
  //   }

  //   let fileInfos = [];

  //   files.forEach((file) => {
  //     fileInfos.push({
  //       name: file,
  //       url: "http://localhost:3000/api/file/" + req.params.section_id + "/" + file,
  //     });
  //   });

  //   res.status(200).json({message: "success", data: fileInfos});
  // });
};

exports.download = (req, res) => {
  const params = {
    Bucket: config.AWS_BUCKET_NAME,
    Key: req.params.section_id + '/' +req.params.filename
  }
 
  res.setHeader('Content-Disposition', 'attachment');
 
  s3.getObject(params)
    .createReadStream()
      .on('error', function(err){
        console.log("get");
        console.log(req.params);
        res.status(200).json({message: err.message});
    }).pipe(res);
  // const fileName = req.params.name;
  // const directoryPath = __basedir + resourcesDir + req.params.section_id + "/";

  // res.download(directoryPath + fileName, fileName, (err) => {
  //   if (err) {
  //     res.status(200).send({
  //       message: "Could not download the file. " + err,
  //     });
  //   }
  // });
};

exports.delete = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + resourcesDir + req.params.section_id + "/";

  fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      res.status(200).send({
        message: "Could not delete the file. " + err,
      });
    }
    else {
      return res.status(200).json({message: "success"})
    }
  });
  //Need to delete folder when folder is empty
};
