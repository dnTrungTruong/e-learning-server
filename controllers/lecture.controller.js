const Lecture = require('../models/lecture.model')
const Section = require('../models/section.model')


exports.createLecture = function(req, res, next){
    const lecture = new Lecture(req.body);

    lecture.save(function (err, createdLecture) { 
        if (err) {
            next(err)
        }
        else { //After saved, add Lecture to the index position lectures list in course by using splice()
            Section.findById(createdLecture.section, function (err, result) {
                if (err) {
                    next (err);
                }
                else {
                    //insert or append to lectures list depend on index
                    if (req.params.index) {
                        result.lectures.splice(req.params.index, 0, createdLecture._id);
                    }
                    //insert to the end of lectures list
                    else {
                        result.lectures.push(createdLecture._id);
                    }
                    
                    result.save(function (err) {
                        if (err) {
                            next(err);
                        }
                        else {
                            res.status(200).json({message: "success", data: createdLecture})
                        }
                    })
                    
                }
            })
        }
    })  
}

exports.getLectureInfo = function (req, res, next) {
    Lecture.findById(req.params.id, function (err, lecture) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({message: "success", data: lecture });
        }
    });
}

exports.getLectureList = function (req, res ,next){
    Section.findById(req.params.section_id)
    .populate('lectures')
    .exec(function(err, result) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({message: "success", data: result.lectures });
        }
    })
}


exports.editLecture = function (req, res ,next) {
    Lecture.findById(req.params.id, function (err, lecture) {
        if (err) {
            next(err);
        }
        else {
            lecture.name = req.body.name || lecture.name;
            
            lecture.save(function (err, updatedLecture) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({message: "success", data: updatedLecture})
                }
            })
        }
    })
}

exports.deleteLecture = function(req, res, next){
    Lecture.findById(req.params.id, function (err, lecture) {
        if (err) {
            next(err);
        }
        else {
            Section.findById(lecture.section, function (err, result) {
                if (err) {
                    next(err);
                }
                else { //Delete lecture in the lectures list first
                    result.lectures.splice(result.lectures.indexOf(lecture.id), 1)
                    result.save(function (err) {
                        if (err) {
                            next(err)
                        }
                        else { //then remove it from database
                            lecture.remove(function (err, deletedLecture) {
                                if (err) {
                                    next(err);
                                }
                                else {
                                    res.status(200).json({message: "success", data : deletedLecture})
                                }
                            })
                        }
                    })
                    
                }
            })
            
        }
    })
}