const util = require('util');
const multer = require('multer');
const path = require('path');

const maxSize = 20 * 1024 * 1024; //Max is 20mb
const resourcesDir = "/resources/";
const tempDir = "/temp/"
const __basedir = path.resolve();

//define storages
let docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + resourcesDir + req.params.section_id + "/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

let imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

//upload function
let uploadDoc = multer({
  storage: docStorage,
  limits: { fileSize: maxSize },
  fileFilter: function (_req, file, cb) { checkFileType(file, cb); }
}).single("file");

let uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: maxSize },
  fileFilter: function (_req, file, cb) { checkImageType(file, cb); }
}).single("image");

//filter functions to check file type
function checkFileType(file, cb) {
  // Allowed ext
  const fileExtensions = /doc|docx|ppt|rar|zip|txt|pdf/;
  const fileTypes = /doc|docx|vnd.ms-powerpoint|x-rar-compressed|zip|text|pdf/;
  // Check ext
  const extname = fileExtensions.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Only these files are allowed: doc, docx, ppt, rar, txt or pdf'); //Need to change this line
  }
}

function checkImageType(file, cb) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Only these files are allowed: jpeg, jpg, png or gif'); //Need to change this line
  }
}
let uploadFileMiddleware = util.promisify(uploadDoc);
let uploadImageMiddleware = util.promisify(uploadImage);

module.exports.uploadDoc = uploadFileMiddleware;
module.exports.uploadImage = uploadImageMiddleware;