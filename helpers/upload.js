const util = require('util');
const multer = require('multer');
const path = require('path');

const maxSize = 20 * 1024 * 1024; //Max is 20mb
const resourcesDir = "/resources/";
const __basedir = path.resolve();

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __basedir + resourcesDir +req.params.section_id +"/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname );
    }
  });

let uploadFile = multer({
 storage: storage,
 limits: { fileSize: maxSize },
 fileFilter: function(_req, file, cb) {checkFileType(file, cb);}
}).single("file");

function checkFileType(file, cb){
  // Allowed ext
  const fileExtensions = /doc|docx|ppt|rar|zip|txt|pdf/;
  const fileTypes = /doc|docx|vnd.ms-powerpoint|x-rar-compressed|zip|text|pdf/;
  // Check ext
  const extname = fileExtensions.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = fileTypes.test(file.mimetype);
  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Only these files are allowed: doc, docx, ppt, rar, txt or pdf'); //Need to change this line
  }
}

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;