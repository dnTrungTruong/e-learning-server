const jwt = require('express-jwt');
const { secret } = require('config.json');
const User = require('../models/user.model');
const Section = require('../models/section.model');
const Lecture = require('../models/lecture.model');



exports.authorize=function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        (req, res, next) => {
            if (roles.length && !roles.includes(req.user.role)) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            res.locals.user = req.user;
            next();
        }
    ];
}

exports.authorizeCreatedCourse = function () {
    return [
        (req, res , next) => {
            User.findById(req.user.sub, function (err, user) {
                if (err) {
                    next(err);
                }
                else {
                    if (user.createdCourses.includes(req.params.id)) {
                        next()
                    }
                    else {
                        return res.status(401).json({ message: 'Unauthorized' });
                    }             
                }
            });
        }
    ];
}

exports.authorizeCreatedCourseWithSection = function () {
    return [
        (req, res , next) => {
            User.findById(req.user.sub, function (err, user) {
                if (err) {
                    next(err);
                }
                else {
                    // if method is POST then the course_id is in req.body.course
                    if (req.method == "POST") {
                        if (req.body.course) {
                            if (user.createdCourses.includes(req.body.course)) {
                                next()
                            }
                            else {
                                return res.status(401).json({ message: 'Unauthorized' });
                            }
                        }
                        else {
                            next()
                        }
                    }
                    //else we need to find the section with the section_id in the params to get the course_id
                    else {
                        Section.findById(req.params.id, function (err, section) {
                            if (err) {
                                next(error);
                            }
                            else {
                                if (user.createdCourses.includes(section.course)) {
                                    next()
                                }
                                else {
                                    return res.status(401).json({ message: 'Unauthorized' });
                                }                        
                            }
                        })
                    }
                }
            });
        }
    ];
}

exports.authorizeCreatedCourseWithLecture = function () {
    return [
        (req, res , next) => {
            User.findById(req.user.sub, function (err, user) {
                if (err) {
                    next(err);
                }
                else {
                    // if method is POST then the course_id is in req.body.course
                    if (req.method == "POST") {
                        if (req.body.course) {
                            if (user.createdCourses.includes(req.body.course)) {
                                next()
                            }
                            else {
                                return res.status(401).json({ message: 'Unauthorized' });
                            }
                        }
                        else {
                            next()
                        }
                    }
                    //else we need to find the section with the lecture_id in the params to get the course_id
                    else {
                        Lecture.findById(req.params.id, function (err, lecture) {
                            if (err) {
                                next(error);
                            }
                            else {
                                if (user.createdCourses.includes(lecture.course)) {
                                    next()
                                }
                                else {
                                    return res.status(401).json({ message: 'Unauthorized' });
                                }                        
                            }
                        })
                    }
                }
            });
        }
    ];
}

exports.authorizeEnrolledCourse = function () {
    return [
        (req, res , next) => {
            User.findById(req.user.sub, function (err, user) {
                if (err) {
                    next(err);
                }
                else {
                    // if method is POST then the course_id is in req.body.course
                    Section.findById(req.params.section_id, function(err, section) {
                        if (err) {
                            next(err)
                        }
                        else {
                            if(req.method == "GET") {
                                if (user.enrolledCourses.includes(section.course)) {
                                    next()
                                }
                                else {
                                    return res.status(401).json({ message: 'Unauthorized' });
                                }
                            }
                            else {
                                if (user.createdCourses.includes(section._id)) {
                                    next()
                                }
                                else {
                                    return res.status(401).json({ message: 'Unauthorized' });
                                }
                            }
                        }
                    })
                }
            });
        }
    ];
}