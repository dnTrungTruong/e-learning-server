const Lesson = require('../models/lesson.model')
const Section = require('../models/section.model')


exports.createLesson = function(req, res, next){
    const lesson = new Lesson(req.body);

    lesson.save(function (err, createdLesson) { 
        if (err) {
            next(err)
        }
        else { //After saved, add Lesson to the index position lesson list in course by using splice()
            Section.findById(createdLesson.section, function (err, result) {
                if (err) {
                    next(err);
                }
                else {
                    if(!result) {
                        return res.status(200).json({ message: "Provided section is not valid"}); 
                    }
                    //insert or append to lessons list depend on index
                    if (req.params.index) {
                        result.lessons.splice(req.params.index, 0, createdLesson._id);
                    }
                    //insert to the end of lessons list
                    else {
                        result.lessons.push(createdLesson._id);
                    }
                    
                    result.save(function (err) {
                        if (err) {
                            next(err);
                        }
                        else {
                            res.status(200).json({message: "success", data: createdLesson})
                        }
                    })
                    
                }
            })
        }
    })  
}

exports.getLessonInfo = function (req, res, next) {
    Lesson.findById(req.params.id, function (err, lesson) {
        if (err) {
            next(err);
        }
        else {
            if(!lesson) {
                return res.status(200).json({ message: "No result"}); 
            }
            res.status(200).json({message: "success", data: lesson });
        }
    });
}

exports.getLessonList = function (req, res ,next){
    Section.findById(req.params.id)
    .populate('lessons')
    .exec(function(err, result) {
        if (err) {
            next(err);
        }
        else {
            if(!result) {
                return res.status(200).json({ message: "No result"}); 
            }
            res.status(200).json({message: "success", data: result.lessons });
        }
    })
}


exports.editLesson = function (req, res ,next) {
    Lesson.findById(req.params.id, function (err, lesson) {
        if (err) {
            next(err);
        }
        else {
            if(!lesson) {
                return res.status(200).json({ message: "Provided lesson is not valid"}); 
            }
            lesson.name = req.body.name || lesson.name;
            lesson.path = req.body.path || lesson.path;
            lesson.description = req.body.description || lesson.description;
            
            lesson.save(function (err, updatedLesson) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({message: "success", data: updatedLesson})
                }
            })
        }
    })
}

exports.deleteLesson = function(req, res, next){
    Lesson.findById(req.params.id, function (err, lesson) {
        if (err) {
            next(err);
        }
        else {
            if(!lesson) {
                return res.status(200).json({ message: "Provided lesson is not valid"}); 
            }
            Section.findById(lesson.section, function (err, result) {
                if (err) {
                    next(err);
                }
                else { 
                    if(!result) {
                        return res.status(200).json({ message: "Provided section is not valid"}); 
                    }
                    //Delete lesson in the lessons list first
                    result.lessons.splice(result.lessons.indexOf(lesson._id), 1)
                    result.save(function (err) {
                        if (err) {
                            next(err)
                        }
                        else { //then remove it from database
                            lesson.remove(function (err, deletedLesson) {
                                if (err) {
                                    next(err);
                                }
                                else {
                                    res.status(200).json({message: "success", data : deletedLesson})
                                }
                            })
                        }
                    })
                    
                }
            })
            
        }
    })
}