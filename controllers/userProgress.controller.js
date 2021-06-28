const UserProgress = require('../models/userProgress.model');

exports.createUserProgress = function (req, res, next) {
    UserProgress.findOne({ user: res.locals.user.sub, course: req.params.id }, function (err, userProgress) {
        if (err) 
            next(err);
        else {
            console.log(userProgress);
            if (userProgress) {
                return res.status(200).json({message: "User progress for this course have already been created"});
            }
            const newUserProgress = new UserProgress({
                user: res.locals.user.sub,
                course: req.params.id
            });
        
            newUserProgress.save(function (err, createdUserProgress) {
                if (err) next(err);
                else {
                    res.status(200).json({ message: "success", data: createdUserProgress });
                }
            })
        }
    })
    
}

exports.getUserProgress = function (req, res, next) {
    UserProgress.findOne({ user: res.locals.user.sub, course: req.params.id }, function (err, userProgress) {
        if (err) next(err);
        else {
            if (!userProgress) return res.status(200).json({ message: "No result" });
            res.status(200).json({ message: "success", data: userProgress });
        }
    })
}

exports.updateCurrentLesson = function (req, res, next) {
    console.log(req.body);
    if (!req.body.section) {
        return res.status(200).json({ message: "Section is required" });
    }
    if (req.body.lessonIndex == undefined) {
        return res.status(200).json({ message: "LessonIndex is required" });
    }
    UserProgress.findOne({ user: res.locals.user.sub, course: req.params.id }, function (err, userProgress) {
        if (err) next(err);
        else {
            if (!userProgress) return res.status(200).json({ message: "No result" });
            const sectionIndex = userProgress.progresses.findIndex((element) => element.section == req.body.section);
            if (sectionIndex != -1) {
                userProgress.progresses[sectionIndex].currentLesson = req.body.lessonIndex;
            }
            else {
                userProgress.progresses.push({
                    section: req.body.section,
                    currentLesson: req.body.lessonIndex,
                    passedLessons: []
                });
            }
            console.log(userProgress);
            userProgress.save(function(err, updatedUserProgress) {
                if (err) 
                    next(err);
                else {
                    res.status(200).json({ message: "success", data: updatedUserProgress });
                }
            })
        }
    })
}