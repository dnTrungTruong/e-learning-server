const Certificate = require('../models/certificate.model');
const Attempt = require('../models/attempt.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');
const Jimp = require('jimp');
const fs = require('fs');
const s3 = require('../helpers/s3');
const config = require('../config.json')

exports.getCertificate = function (req, res, next) {
    Certificate.findById({ _id: req.params.id })
        .populate(
            [{
                path: 'user',
                model: 'User',
                select: ['_id', 'firstname', 'lastname', 'email'],
            },
            {
                path: 'course',
                model: 'Course',
                select: ['_id', 'name', 'instructor'],
                populate: {
                    path: 'instructor',
                    model: 'User',
                    select: ['_id', 'firstname', 'lastname']
                }
            }]
        )
        .exec(function (err, certificate) {
            if (err) {
                next(err);
            }
            else {
                if (!certificate) {
                    return res.status(200).json({ message: "No result" });
                }
                res.status(200).json({ message: "success", data: certificate });
            }
        });
}

exports.createCertificate = async function (req, res, next) {
    Attempt.findOne({ user: res.locals.user.sub, course: req.body.course })
        .populate({
            path: 'quizzes.quiz',
            model: 'Quiz',
            select: ['_id', 'course', 'isFinal']
        })
        .exec(function (err, attempt) {
            if (err) {
                next(err);
            }
            else {
                if (!attempt) {
                    return res.status(200).json({ message: "No attempt was found" });
                }
                if (attempt.certificate) {
                    return res.status(200).json({ message: "This attempt has already have a certificate" });
                }
                var finalQuizIndex = -1;
                for (let i = 0; i < attempt.quizzes.length; i++) {
                    if (!attempt.quizzes[i].isPassed) {
                        return res.status(200).json({ message: "All the quiz must be passed before claiming certificate" });
                    }
                    if (attempt.quizzes[i].quiz.isFinal) {
                        finalQuizIndex = i;
                    }
                }
                if (finalQuizIndex < 0) {
                    return res.status(200).json({ message: "Final quiz seems to be not passed" });
                }
                let cert = new Certificate({
                    course: attempt.course,
                    user: res.locals.user.sub,
                    finalScore: attempt.quizzes[finalQuizIndex].highestScore,
                    date: Date.now()
                });
                console.log(cert);

                makeCertificate(cert.course, cert.user, cert._id, cert.date)
                    .then(result => {
                        if (result.message == "success") {
                            const params = {
                                Bucket: config.AWS_BUCKET_NAME,
                                Key: "course_certificates/" + Date.now() + '-' + cert._id + ".png",
                                ACL: 'public-read',
                                Body: result.data
                            };

                            // Uploading files to the bucket
                            s3.upload(params, function (err, data) {
                                if (err) {
                                    throw err;
                                }
                                cert.url = data.Location;
                                //cert.url = data.key.split('/')[1];
                                //cert.url = `${baseUrl}/s3/certificate/${req.params.course_id}/${data.key.split('/')[1]}`;

                                //save
                                cert.save(function (err, createdCert) {
                                    if (err) {
                                        next(err);
                                    }
                                    else {
                                        attempt.certificate = createdCert._id;
                                        attempt.save(function (err) {
                                            if (err) {
                                                next(err);
                                            }
                                            else {
                                                return res.status(200).json({ message: "success", data: createdCert });
                                            }
                                        });
                                    }
                                })
                            });
                        }
                        else {
                            console.log(result);
                            next(result.message);
                        }
                    })
            }
        })
}

const makeCertificate = (course, user, certId, certDate) => {
    return new Promise((resolve, reject) => {
        Jimp.read("./assets/certificate.png").then(image => {
            const Sanchez_50_Aqua = Jimp.loadFont("./assets/fonts/Sanchez-50-Aqua.fnt");
            const Sanchez_20_Aqua = Jimp.loadFont("./assets/fonts/Sanchez-20-Aqua.fnt");
            const Sanchez_26_Darkblue = Jimp.loadFont("./assets/fonts/Sanchez-26-Darkblue.fnt");
            const Sanchez_22_Aqua = Jimp.loadFont("./assets/fonts/Sanchez-22-Aqua.fnt");
            const Sanchez_22_Darkblue = Jimp.loadFont("./assets/fonts/Sanchez-22-Darkblue.fnt");
            const Sanchez_18_Darkblue = Jimp.loadFont("./assets/fonts/Sanchez-18-Darkblue.fnt");
            const courseRetObj = Course.findById(course).populate('instructor', 'firstname lastname').select('name instructor');
            const userRetObj = User.findById(user).select('firstname lastname email')
            return Promise.all([
                image, Sanchez_50_Aqua, Sanchez_20_Aqua, Sanchez_26_Darkblue, Sanchez_22_Aqua, Sanchez_22_Darkblue, Sanchez_18_Darkblue, courseRetObj, userRetObj
            ]);
        }).then((returnValues) => {
            const image = returnValues[0];
            const Sanchez_50_Aqua = returnValues[1];
            const Sanchez_20_Aqua = returnValues[2];
            const Sanchez_26_Darkblue = returnValues[3];
            const Sanchez_22_Aqua = returnValues[4];
            const Sanchez_22_Darkblue = returnValues[5];
            const Sanchez_18_Darkblue = returnValues[6];
            const courseRetObj = returnValues[7];
            const userRetObj = returnValues[8];

            //Print student name & email
            let xCordinate = 370;
            let yCordinate = 385;

            image.print(
                Sanchez_50_Aqua, xCordinate, yCordinate, `${userRetObj.firstname} ${userRetObj.lastname}`, 700
            );
            let accountYCordinate = yCordinate + Jimp.measureTextHeight(Sanchez_50_Aqua, `${userRetObj.firstname} ${userRetObj.lastname}`, 700) + 10;

            image.print(
                Sanchez_20_Aqua, xCordinate, accountYCordinate, `(Account: ${userRetObj.email})`
            );
            //Print certificate content & course name
            let contentYCordinate = accountYCordinate + Jimp.measureTextHeight(Sanchez_20_Aqua, `(Account: ${userRetObj.email})`) + 25; // height of text
            image.print(
                Sanchez_26_Darkblue, xCordinate, contentYCordinate, 'Has successfully completed the course'
            );
            image.print(
                Sanchez_26_Darkblue, xCordinate, contentYCordinate + 40, courseRetObj.name, 400
            );
            //Print instructor name
            let instructorXCordinate = 55;
            let instructorYCordinate = 558;
            let instructorNameMaxWidth = 280;
            let space = 29;
            let instructorName = `${courseRetObj.instructor.firstname} ${courseRetObj.instructor.lastname}`;
            let measureTextWidth = Jimp.measureText(Sanchez_22_Aqua, instructorName, instructorNameMaxWidth);
            if (measureTextWidth > instructorNameMaxWidth) {
                image.print(
                    Sanchez_22_Aqua, instructorXCordinate + 40, instructorYCordinate, instructorName, instructorNameMaxWidth - 40
                );
                space = 58;
            }
            else {
                image.print(
                    Sanchez_22_Aqua, instructorXCordinate + 15, instructorYCordinate, instructorName, instructorNameMaxWidth
                );
            }

            let instructorNameXCordinate = 85;
            let instructorNameYCordinate = instructorYCordinate + space + 7;
            image.print(
                Sanchez_22_Darkblue, instructorNameXCordinate, instructorNameYCordinate, 'Course Instructor'
            );
            //Print date & certificate number
            let dateXCordinate = 88;
            let dateYCordinate = 732;
            image.print(
                Sanchez_18_Darkblue, dateXCordinate, dateYCordinate, new Date(certDate).toJSON().slice(0, 10).split('-').reverse().join('/')
            );
            let cerNoXCordinate = 172;
            let cerNoYCordinate = 764;
            image.print(
                Sanchez_18_Darkblue, cerNoXCordinate, cerNoYCordinate, certId
            );
            //Output file to upload to S3
            image.getBuffer(Jimp.AUTO, function (err, buffer) {
                console.log(buffer);
                let result = {
                    message: "success",
                    data: buffer
                }
                resolve(result);
            })
        })
            .catch(err => {
                console.log(err);
                let result = {
                    message: err
                }
                reject(result);
            })
    })
}