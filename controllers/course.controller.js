const Course = require('../models/course.model')
const User = require('../models/user.model')
const Subject = require('../models/subject.model');
const { search } = require('../routes/course.route');
const { query } = require('express');
const Constants = require('../helpers/constants')


exports.createCourse = function (req, res, next) {
    const course = new Course(req.body);

    //The instructor will be the user who send the request
    course.instructor = res.locals.user.sub;
    course.status = Constants.COURSE_STATUS.NEW;

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

exports.getCourseDetails = function (req, res, next) {
    Course.findById(req.params.id)
        .populate('subject', 'name')
        .populate('instructor', 'firstname lastname')
        .populate({
            path: 'sections',
            model: 'Section',
            select: { '_id': 1, 'name': 1, 'lectures': 1 },
            populate: {
                path: 'lectures',
                model: 'Lecture',
                select: { '_id': 1, 'name': 1 }
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

exports.getProgramingCourseDetails = function (req, res, next) {
    Course.findById(req.params.id)
        .populate('subject', 'name')
        .populate('instructor', 'firstname lastname')
        .populate({
            path: 'sections',
            model: 'Section',
            select: { '_id': 1, 'name': 1, 'description': 1, 'lessons': 1 },
            populate: {
                path: 'lessons',
                model: 'Lesson',
                select: { '_id': 1, 'name': 1 }
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
        .populate('subject', 'name')
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


exports.getProgramingCourseLearningDetails = function (req, res, next) {
    Course.findById(req.params.id)
        .populate('instructor', 'firstname lastname')
        .populate('subject', 'name')
        .populate({
            path: 'sections',
            model: 'Section',
            populate: [{
                path: 'lessons',
                model: 'Lesson'
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

exports.getCourseListAll = async function (req, res, next) {
    const limit = req.query.size ? parseInt(req.query.size) : 5;
    const offset = req.query.page ? parseInt(req.query.page) * limit : 0;

    var condition = {};
    if (req.query.keyword) {
        let users = await User.find({ $text: { $search: req.query.keyword } }, { _id: 1 });

        if (req.query.status) {
            condition = {
                $and: [
                    { status: { $in: req.query.status } },
                    {
                        $or: [
                            //{ $text: {$search: req.query.keyword} }, // Method 1: Using index
                            { name: { "$regex": req.query.keyword, "$options": "i" } }, //Method 2: Using regex
                            { instructor: { $in: users } }
                        ]
                    }
                ]
            }
        }
        else {
            condition = {
                $or: [
                    //{ $text: {$search: req.query.keyword} }, // Method 1: Using index
                    { name: { "$regex": req.query.keyword, "$options": "i" } }, //Method 2: Using regex
                    { instructor: { $in: users } }
                ]
            }
        }
    }
    else {
        if (req.query.status) {
            condition = {
                status: { $in: req.query.status } 
            };
        }
        else {
            condition = {};
        }
    }
    const options = {
        sort: { status: -1 },
        select: 'name subject instructor img_url status type',
        populate: [
            { path: 'subject', model: 'Subject', select: 'name' },
            { path: 'instructor', model: 'User', select: 'firstname lastname' }
        ],
        offset: offset,
        limit: limit
    }
    Course.paginate(condition, options)
        .then((data) => {
            const returnData = {
                totalItems: data.totalDocs,
                courses: data.docs,
                totalPages: data.totalPages,
                currentPage: data.page - 1,
            }
            if (data.docs.length) {
                res.status(200).json({ message: "success", data: returnData });
            }
            else {
                res.status(200).json({ message: "No result" });
            }
        })
        .catch((err) => {
            next(err);
        })
}

exports.getPendingCoursesCount = function (req, res, next) {
    Course.countDocuments({ status: Constants.COURSE_STATUS.PENDING }, function (err, count) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ message: "success", data: count });
        }
    })
}

exports.getCourseList = function (req, res, next) {
    Course.find({ status: Constants.COURSE_STATUS.APPROVED })
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

exports.getNewCourses = function (req, res, next) {
    Course.find({ status: Constants.COURSE_STATUS.APPROVED, tags: "new" })
        .limit(5)
        .populate('instructor', 'firstname lastname')
        .then((result) => {
            if (!result.length) {
                return res.status(200).json({ message: "No result" });
            }
            //Mix courses up and get only 4
            let sortedResult = result.sort(() => 0.5 - Math.random());
            res.status(200).json({ message: "success", data: sortedResult });
        })
        .catch((err) => {
            next(err);
        })
}


exports.getRandomCourses = async function (req, res, next) {
    try {
        const randomCourses = await Course.aggregate([
            { $match: { status: Constants.COURSE_STATUS.APPROVED }},
            { $sample: { size : 8 }}
        ]);
        await User.populate(randomCourses, {path: "instructor", select: {firstname: 1, lastname: 1}});
        if (!randomCourses.length) {
            return res.status(200).json({ message: "No result" });
        }
        res.status(200).json({ message: "success", data: randomCourses });
    }
    catch (err) {
        next(err);
    }
        
}

exports.getHotCourses = function (req, res, next) {
    Course.find({ status: Constants.COURSE_STATUS.APPROVED, tags: "hot" })
        .limit(4)
        .then((result) => {
            if (!result.length) {
                return res.status(200).json({ message: "No result" });
            }
            //Mix courses up and get only 4
            let sortedResult = result.sort(() => 0.5 - Math.random());
            res.status(200).json({ message: "success", data: sortedResult });
        })
        .catch((err) => {
            next(err);
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
            course.status = Constants.COURSE_STATUS.PENDING;
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
    Course.updateOne({ _id: courseId }, { status: Constants.COURSE_STATUS.APPROVED }, function (err) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ message: "success" })
        }
    })
}

exports.rejectCourse = function (req, res, next) {
    const courseId = req.params.id;
    Course.updateOne({ _id: courseId }, { status: Constants.COURSE_STATUS.REJECTED }, function (err) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ message: "success" })
        }
    })
}

exports.disableCourse = function (req, res, next) {
    const courseId = req.params.id;
    Course.updateOne({ _id: courseId }, { status: Constants.COURSE_STATUS.DISABLED }, function (err) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ message: "success" })
        }
    })
}

exports.searchCourse = async function (req, res, next) {

    //UPDATE: This search is done manually, theres a new way with pagination plugin
    try {
        let searchQuery = [];
        let sortBy = {};

        //Search for the subject_id to filter
        if (req.query.subject) {
            sub = await Subject.findOne({ name: { "$regex": req.query.subject, "$options": "i" } }, { _id: 1 });
            //Only filter with subject when we find a result
            if (sub) { searchQuery.push({ subject: sub._id }); }
        }
        //Search for users who have name matched keyword
        //(OLD)
        //Method 1: {name: { "$regex": (req.query.keyword ? req.query.keyword : false), "$options": "i" }} - Find the names that contains keyword(string)
        //Method 2: { $text: {$search: ((req.query.keyword ? req.query.keyword : false))}} - Split keyword(string) into words and find names that matched any word
        //We're using method 2 to find instructor name and method 1 for course name
        if (req.query.keyword) {
            let users = await User.find({ $text: { $search: req.query.keyword } }, { _id: 1 });
            //Search with keyword or instructor name
            searchQuery.push({ $or: [{ name: { "$regex": req.query.keyword, "$options": "i" } }, { instructor: { $in: users } }] });
        }
        //Only search approved courses
        searchQuery.push({ status: Constants.COURSE_STATUS.APPROVED });
        //Sorting with price
        if (req.query.price) {
            sortBy.price = (req.query.price === "descending" ? "descending" : "ascending");
        }
        //Sorting with reviews
        //if (req.query.review) {
        //  sortBy.review = (review==="descending" ? "descending" : "ascending");
        //}
        //------------------

        //Pagination (OLD)
        // const page = req.query.page ? parseInt(req.query.page) : 1;
        // const pagination = req.query.pagination ? parseInt(req.query.pagination) : 10;

        // let courses = await Course.find()
        //     .and(searchQuery)
        //     .sort(sortBy)
        //     .skip((page - 1) * 1)
        //     .limit(pagination)
        //     .populate('instructor', 'firstname lastname');



        // if (courses.length) {
        //     return res.status(200).json({ message: "success", data: courses });
        //     //return res.status(200).json({message: "sucess", data: {courses: courses, count: count}});
        // }
        // else {
        //     return res.status(200).json({ message: "No result" });
        // }
        const limit = req.query.size ? parseInt(req.query.size) : 5;
        const offset = req.query.page ? parseInt(req.query.page) * limit : 0;
        const options = {
            sort: sortBy,
            populate: [
                // { path: 'subject', model: 'Subject', select: 'name'},
                { path: 'instructor', model: 'User', select: 'firstname lastname' }
            ],
            offset: offset,
            limit: limit
        }
        let condition = {
            $and: searchQuery
        };
        Course.paginate(condition, options)
            .then((data) => {
                const returnData = {
                    totalItems: data.totalDocs,
                    courses: data.docs,
                    totalPages: data.totalPages,
                    currentPage: data.page - 1,
                }
                if (data.docs.length) {
                    res.status(200).json({ message: "success", data: returnData });
                }
                else {
                    res.status(200).json({ message: "No result" });
                }
            })
            .catch((err) => {
                next(err);
            })
    }
    catch (err) {
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

exports.editCourseTags = function (req, res, next) {
    Course.findById(req.params.id, function (err, course) {
        if (err) {
            next(err);
        }
        else {
            if (!course) {
                return res.status(200).json({ message: "Provided course is not valid" });
            }
            course.tags = req.body.tags || course.tags;

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

