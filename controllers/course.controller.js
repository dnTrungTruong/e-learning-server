const Course = require('../models/course.model')
const User = require('../models/user.model')
const Subject = require('../models/subject.model')

exports.createCourse = function (req, res, next) {
    const course = new Course(req.body);

    //The instructor will be the user who send the request
    course.instructor = res.locals.user.sub;

    course.save(function (err, createdCourse) {
        if (err) {
            next(err)
        }
        else {
            User.findById(createdCourse.instructor, function (err, user) {
                if (err) {
                    next(err);
                }
                else {
                    if (!user) {
                        return res.status(200).json({ message: "Provided user is not valid"});
                    }
                    user.createdCourses.push(createdCourse._id);

                    user.save(function (err, updatedUser) {
                        if (err) {
                            next(err);
                        }
                        else {
                            res.status(200).json({ message: "success", data: createdCourse });
                        }
                    })
                }
            })
        }
    })
}

exports.getCourseInfo = function (req, res, next) {
    Course.findById(req.params.id, function (err, course) {
        if (err) {
            next(err);
        }
        else {
            if (!course) {
                return res.status(200).json({ message: "No result"});
            }
            res.status(200).json({ message: "success", data: course });
        }
    });
}
//Get course with detail information using populate
exports.getCourseDetails = function (req, res, next) {
    Course.findById(req.params.id)
        .populate('subject', 'name')
        .populate('instructor', 'firstname lastname')
        .populate('sections', 'name')
        .exec(function (err, course) {
            if (err) {
                next(err);
            }
            else {
                if (!course) {
                    return res.status(200).json({ message: "No result"});
                }
                res.status(200).json({ message: "success", data: course });
            }
        });
}

exports.getCourseList = function (req, res, next) {
    Course.find({ status: "Approved" },)
        .populate('instructor', 'firstname lastname')
        .exec(
            function (err, result) {
                if (err) {
                    next(err);
                }
                else {
                    if (!result) {
                        return res.status(200).json({ message: "No result"});
                        
                    }
                    res.status(200).json({ message: "success", data: result });
                }
            })
}

exports.getHotCourses = function (req, res, next) {
    Course.find({ status: "Approved" },//)
        //.exec(
        function (err, result) {
            if (err) {
                next(err);
            }
            else {
                if (!result) {
                    return res.status(200).json({ message: "No result"});
                }
                //Need to implement hot search not random
                let sortedResult = result.sort(() => 0.5 - Math.random()).slice(0, 4);
                res.status(200).json({ message: "success", data: sortedResult });
            }
        })
}

exports.getCourseListByStatus = function (req, res, next) {
    Course.find({ status: req.params.status }, function (err, result) {
        if (err) {
            next(err);
        }
        else {
            if (!result) {
                return res.status(200).json({ message: "No result"}); 
            }
            res.status(200).json({ message: "success", data: result });
        }
    })
}

exports.submitCourseForApproval = function (req, res, next) {
    const courseId = req.params.id;
    Course.findById(courseId, function (err, course) {
        if (err) {
            next(err);
        }
        else {
            if (!course) {
                return res.status(200).json({ message: "Course provided course not exist" });
            }
            if (course.status) {
                return res.status(200).json({ message: "This course has already been submitted for approval" })
            }
            course.status = "Pending"
            course.save(function (err) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({ message: "success" });
                }
            })
        }
    })
}

exports.approveCourse = function (req, res, next) {
    const courseId = req.params.id;
    Course.updateOne({ _id: courseId }, { status: "Approved" }, function (err) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ message: "success" })
        }
    })
}


exports.searchCourse = function (req, res, next) {
    if (req.params.keyword) {
        Subject.findOne({ name: { "$regex": req.params.keyword, "$options": "i" } }, function (err, subjectResult) {
            if (err) {
                next(err);
            }
            else {
                if (subjectResult) {
                    Course.find()
                        .and([
                            { status: "Approved" },
                            { $or: [{ name: { "$regex": req.params.keyword, "$options": "i" } }, { subject: subjectResult._id }] }
                        ])
                        .populate('instructor', 'firstname lastname')
                        .exec(function (err, result) {
                            if (err) {
                                next(err);
                            }
                            else {
                                if(!result) {
                                    return res.status(200).json({ message: "No result"}); 
                                }
                                return res.status(200).json({ message: "success", data: result });
                            }
                        })
                }
                else {
                    Course.find()
                        .and([
                            { status: "Approved" },
                            { name: { "$regex": req.params.keyword, "$options": "i" } }
                        ])
                        .populate('instructor', 'firstname lastname')
                        .exec(function (err, result) {
                            if (err) {
                                next(err);
                            }
                            else {
                                if(!result) {
                                    return res.status(200).json({ message: "No result"}); 
                                }
                                return res.status(200).json({ message: "success", data: result });
                            }
                        })
                }
            }
        })
    }
    else {
        Course.find({ status: "Approved" },)
        .populate('instructor', 'firstname lastname')
        .exec(
            function (err, result) {
                if (err) {
                    next(err);
                }
                else {
                    if(!result) {
                        return res.status(200).json({ message: "No result"}); 
                    }
                    return res.status(200).json({ message: "success", data: result });
                }
            })
    }
}

exports.editCourse = function (req, res, next) {
    Course.findById(req.params.id, function (err, course) {
        if (err) {
            next(err);
        }
        else {
            if(!course) {
                return res.status(200).json({ message: "Provided course is not valid"}); 
            }
            course.name = req.body.name || course.name;
            course.subject = req.body.subject || course.subject;
            course.description = req.body.description || course.description;
            course.price = req.body.price || course.price;
            course.img = req.body.img || course.img;
            course.img_url = req.body.img_url || course.img_url;

            course.save(function (err, updatedCourse) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({ message: "success", data: updatedCourse })
                }
            })
        }
    })
}

exports.deleteCourse = function (req, res, next) {
    Course.findById(req.params.id, function (err, course) {
        if (err) {
            next(err);
        }
        else {
            if(!course) {
                return res.status(200).json({ message: "Provided course is not valid"}); 
            }
            course.remove(function (err, deletedCourse) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({ message: "success", data: deletedCourse })
                }
            })
        }
    })
}

