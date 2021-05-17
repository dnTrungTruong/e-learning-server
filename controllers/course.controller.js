const Course = require('../models/course.model')
const User = require('../models/user.model')
const Subject = require('../models/subject.model');
const { search } = require('../routes/course.route');
const { query } = require('express');

exports.createCourse = function (req, res, next) {
    const course = new Course(req.body);

    //The instructor will be the user who send the request
    course.instructor = res.locals.user.sub;
    course.status = "new";

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
                        return res.status(200).json({ message: "Provided user is not valid" });
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
                return res.status(200).json({ message: "No result" });
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
        //.populate('sections', 'name')
        .populate({
            path: 'sections',
            model: 'Section',
            select: {'_id': 1, 'name': 1, 'lectures': 1},
            populate: {
                path: 'lectures',
                model: 'Lecture',
                select: {'_id': 1, 'name': 1}
            }
        })
        .exec(function (err, course) {
            if (err) {
                next(err);
            }
            else {
                if (!course) {
                    return res.status(200).json({ message: "No result" });
                }
                res.status(200).json({ message: "success", data: course });
            }
        });
}

exports.getCourseLearningDetails = function (req, res, next) {
    Course.findById(req.params.id)
        .populate('instructor', 'firstname lastname')
        //.populate('sections', 'name')
        .populate({
            path: 'sections',
            model: 'Section',
            populate: [{
                path: 'lectures',
                model: 'Lecture',
                populate: {
                    path: 'resources',
                    model: 'Resource'
                }
            },
            {
                path: 'quiz',
                model: 'Quiz'
            },
            {
                path: 'announcements',
                model: 'Announcement'
            }]
        })
        .exec(function (err, course) {
            if (err) {
                next(err);
            }
            else {
                if (!course) {
                    return res.status(200).json({ message: "No result" });
                }
                res.status(200).json({ message: "success", data: course });
            }
        });
}

exports.getCourseList = function (req, res, next) {
    Course.find({ status: "approved" })
        .populate('instructor', 'firstname lastname')
        .exec(
            function (err, result) {
                if (err) {
                    next(err);
                }
                else {
                    if (!result.length) {
                        return res.status(200).json({ message: "No result" });

                    }
                    res.status(200).json({ message: "success", data: result });
                }
            })
}

exports.getHotCourses = function (req, res, next) {
    Course.find({ status: "approved" },//)
        //.exec(
        function (err, result) {
            if (err) {
                next(err);
            }
            else {
                if (!result.length) {
                    return res.status(200).json({ message: "No result" });
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
            if (!result.length) {
                return res.status(200).json({ message: "No result" });
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
            course.status = "pending"
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
    Course.updateOne({ _id: courseId }, { status: "approved" }, function (err) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ message: "success" })
        }
    })
}


exports.searchCourse = async function (req, res, next) {

    try {
        let searchQuery = [];
        let sortBy = {};

        //Search for the subject_id to filter
        if (req.query.sub) { 
            sub = await Subject.findOne({name: { "$regex": req.query.sub, "$options": "i" }}, {_id:1});
            //Only filter with subject when we find a result
            if (sub) { searchQuery.push({subject: sub._id});}
        }
        //Search for users who have name matched keyword
        //(OLD)
        //Method 1: {name: { "$regex": (req.query.keyword ? req.query.keyword : false), "$options": "i" }} - Find the names that contains keyword(string)
        //Method 2: { $text: {$search: ((req.query.keyword ? req.query.keyword : false))}} - Split keyword(string) into words and find names that matched any word
        //We're using method 2 to find instructor name and method 1 for course name
        if (req.query.keyword) {
            let users = await User.find({$text: {$search: req.query.keyword}}, {_id:1});
            //Search with keyword or instructor name
            searchQuery.push({$or: [{name: { "$regex": req.query.keyword, "$options": "i" }}, { instructor: {$in: users}} ]});
        }
        //Only search approved courses
        searchQuery.push({status: "approved"});

        //Sorting with price
        if (req.query.price) {
            sortBy.price = (req.query.price==="descending" ? "descending" : "ascending");
        }
        //Sorting with reviews
        //if (req.query.review) {
        //  sortBy.review = (review==="descending" ? "descending" : "ascending");
        //}
        //------------------

        //Pagination
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;

        let courses = await Course.find()
        .and(searchQuery)
        .sort(sortBy)
        .skip((page - 1) * 1)
        .limit(1)
        .populate('instructor', 'firstname lastname');


        //Find how many results the query really had (not working)
        //let count = await courses.count();

        if (courses.length) {
            return res.status(200).json({message: "success", data: courses});
            //return res.status(200).json({message: "sucess", data: {courses: courses, count: count}});
        }
        else {
            return res.status(200).json({message: "No result"});
        }
    }
    catch(err) {
        next(err);
    }
}

exports.editCourse = function (req, res, next) {
    Course.findById(req.params.id, function (err, course) {
        if (err) {
            next(err);
        }
        else {
            if (!course) {
                return res.status(200).json({ message: "Provided course is not valid" });
            }
            course.name = req.body.name || course.name;
            course.subject = req.body.subject || course.subject;
            course.description = req.body.description || course.description;
            course.objectives = req.body.objectives || course.objectives;
            course.price = req.body.price || course.price;
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
            if (!course) {
                return res.status(200).json({ message: "Provided course is not valid" });
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

