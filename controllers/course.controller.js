const Course = require('../models/course.model')
const User = require('../models/user.model')

exports.createCourse = function(req, res, next) {
    const course = new Course(req.body);

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
                    user.createdCourses.push(createdCourse._id)
                    user.save(function (err, updatedUser) {
                        if (err) {
                            next(err);
                        }
                        else {
                            res.status(200).json({data: createdCourse})
                        }
                    })
                }
            })
        }
    })
}

exports.getCourseInfo = function(req, res, next) {
    Course.findById(req.params.id, function (err, course) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ data: course });
        }
    });
}
//Get course with detail information using populate
exports.getCourseDetails = function(req, res, next) {
    Course.findById(req.params.id)
    .populate('subject', 'name')
    .populate('instructor', 'firstname lastname')
    .populate('sections', 'name')
    .exec(function (err, course) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ data: course });
        }
    });
}

exports.getCourseList = function(req, res, next) {
    Course.find(function(err, result) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ data: result });
        }
    })
}
// This function need configuration
// exports.getCourseListbySubject = function(req, res, next) {
//     Course.find({subject : req.params.sub_id}, function(err, result) {
//         if (err) {
//             next(err);
//         }
//         else {
//             res.status(200).json({ data: result });
//         }
//     })
// }

exports.editCourse = function (req, res ,next) {
    Course.findById(req.params.id, function (err, course) {
        if (err) {
            next(err);
        }
        else {
            course.name = req.body.name || course.name;
            course.subject = req.body.subject || course.subject;
            course.description = req.body.description || course.description;
            course.price = req.body.price || course.price;
            
            course.save(function (err, updatedCourse) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({data: updatedCourse})
                }
            })
        }
    })
}

exports.deleteCourse = function(req, res, next){
    Course.findById(req.params.id, function (err, course) {
        if (err) {
            next(err);
        }
        else {
            course.remove(function (err, deletedCourse) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({data : deletedCourse})
                }
            })
        }
    })
}