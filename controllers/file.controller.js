const upload = require("../helpers/upload");
const Resource = require('../models/resource.model')
const path = require('path');
const fs = require('fs');
const config = require('../config.json')
const s3 = require('../helpers/s3');
const { nextTick } = require("process");

//const resourcesDir = "/resources/";

const port = process.env.NODE_ENV === 'production' ? 80 : 3000;
const baseUrl = `http://localhost:${port}/api/file`;
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
exports.uploadDoc = (req, res) => {
  upload.upload(req, res)
  .then(() => {
    if (req.file == undefined) {
      return res.status(200).send({ message: "Please upload a file!" });
    }
    return res.status(200).json({
      message: "success",
      data: `${baseUrl}/s3/resource/${req.params.course_id}/${encodeURI(req.file.key.substring(req.file.key.lastIndexOf('/')+1))}`
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
  for (var i = 0; i < req.query.fileName.length; i++) {
    if (req.query.fileName.charCodeAt(i) > 127) return res.status(200).json({  message: "File name is not valid. Please dont use any UTF-8 or UTF-16 character."});
  }
  let fileurls = [];
  let fileName = Date.now() + "-" + req.query.fileName;
  let keyName = "course_videos/" + req.params.course_id + "/" + fileName;
    const params = {
        Bucket: config.AWS_BUCKET_NAME,
        Key: keyName,
        Expires: 60 * 60, // Time until presigned URL is valid
        //ACL: 'public-read',
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
            fileurls[1] = encodeURI(fileName); //will save this as url in lecture
            //return res.status(200).json({  message: 'success', data: { fileurl:fileurls, filename: fileName});
            return res.status(200).json({  message: 'success', data: fileurls });
        }
    });
}

// exports.uploadDoc = (req, res) => {
//     fs.mkdir(path.resolve(resourcesDir.replace("/", ""), req.params.section_id), { recursive: true }, err => {
//       if (err) {
//         return res.status(200).json({message: err.message})
//       } 
//       else {
//         upload.uploadDoc(req, res)
//         .then(() => {
//           if (req.file == undefined) {
//             return res.status(200).send({ message: "Please upload a file!" });
//           }
//           //Need to check if file exists (not coded yet) and send message
//           return res.status(200).send({
//             message: "success"
//           });
//         })
//         .catch((err) => {
//           if (err.code == "LIMIT_FILE_SIZE") {
//             return res.status(200).send({
//               message: "File size cannot be larger than 20MB!",
//             });
//           }
      
//           return res.status(200).send({
//             message: `Could not upload the file: ${err}`,
//           });
//         })
//       }
//     });
// };

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
        res.status(200).json({message: "success", data: keys});
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

exports.downloadVideo = (req, res, next) => {
  let keyName = "course_videos" + "/" + req.params.course_id + "/" + req.params.filename;
  
  let params = {
    Bucket: config.AWS_BUCKET_NAME,
    Key: keyName,
    Expires: 60 * 60,
    //ResponseContentDisposition :  `attachment; filename="${keyName}"` 
  }
  s3.getSignedUrlPromise('getObject', params).then(function( url) {
    //return res.status(200).json({message: "success", data: url});
    return res.redirect(url);
  }).catch(next);
};
// OLD - Delete from server local disk
// exports.delete = (req, res) => {
//   const fileName = req.params.name;
//   const directoryPath = __basedir + resourcesDir + req.params.section_id + "/";

//   fs.unlink(directoryPath + fileName, (err) => {
//     if (err) {
//       res.status(200).send({
//         message: "Could not delete the file. " + err,
//       });
//     }
//     else {
//       return res.status(200).json({message: "success"})
//     }
//   });
//   //Need to delete folder when folder is empty
// };

exports.downloadDoc = (req, res, next) => {
  let params = {
    Bucket: config.AWS_BUCKET_NAME,
    Key: 'course_resources/' + req.params.course_id + '/' + req.params.filename
  };
  // s3.getSignedUrlPromise('getObject', params).then(function(url) {
  //   return res.status(200).json({message: "sucess", data: url});
  // })

  res.setHeader('Content-Disposition', 'attachment');
 
  s3.getObject(params)
    .createReadStream()
      .on('error', function(err){
        res.status(200).json({message: err.message});
    }).pipe(res);

};

exports.downloadCertificate = (req, res, next) => {
  let params = {
    Bucket: config.AWS_BUCKET_NAME,
    Key: 'course_certificates/' + req.params.filename
  };
  // s3.getSignedUrlPromise('getObject', params).then(function(url) {
  //   return res.status(200).json({message: "sucess", data: url});
  // })

  res.setHeader('Content-Disposition', 'attachment');
 
  s3.getObject(params)
    .createReadStream()
      .on('error', function(err){
        res.status(200).json({message: err.message});
    }).pipe(res);

};