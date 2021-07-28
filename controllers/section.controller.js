const Section = require('../models/section.model')
const Course = require('../models/course.model')

// exports.createSection = function(req, res, next){
//     const section = new Section(req.body);

//     section.save(function (err, createdSection) { 
//         if (err) {
//             next(err)
//         }
//         else { //After saved, add Section to the end of sections list in course by using push()
//             Course.findById(createdSection.course, function (err, result) {
//                 if (err) {
//                     next (err);
//                 }
//                 else {
//                     result.sections.push(createdSection._id); 
//                     result.save(function (err) { 
//                         if (err) {
//                             next(err);
//                         }
//                         else {
//                             res.status(200).json({data: createdSection})
//                         }
//                     })
                    
//                 }
//             })
//         }
//     })  
// }

exports.createSection = function(req, res, next){
    const section = new Section(req.body);

    section.save(function (err, createdSection) { 
        if (err) {
            next(err)
        }
        else { //After saved, add Section to the index position sections list in course by using splice()
            Course.findById(createdSection.course, function (err, result) {
                if (err) {
                    next (err);
                }
                else {
                    if(!result) {
                        return res.status(200).json({ message: "Provided course is not valid"}); 
                    }
                    //insert or append to sections list depend on index
                    if (req.params.index && req.params.index > 0) {
                        result.sections.splice(req.params.index, 0, createdSection._id);
                    }
                    else {
                        result.sections.push(createdSection._id);
                    }
                    
                    result.save(function (err) {
                        if (err) {
                            next(err);
                        }
                        else {
                            res.status(200).json({message: "success", data: createdSection})
                        }
                    })
                    
                }
            })
        }
    })  
}

exports.getSectionInfo = function (req, res, next) {
    Section.findById(req.params.id, function (err, section) {
        if (err) {
            next(err);
        }
        else {
            if(!section) {
                return res.status(200).json({ message: "No result"}); 
            }
            res.status(200).json({message: "success", data: section });
        }
    });
}

exports.getSectionList = function (req, res ,next){
    Course.findById(req.params.course_id)
    .populate('sections')
    .exec(function(err, result) {
        if (err) {
            next(err);
        }
        else {
            if(!result) {
                return res.status(200).json({ message: "No result"}); 
            }
            res.status(200).json({message: "success", data: result.sections });
        }
    })
}


exports.editSection = function (req, res ,next) {
    Section.findById(req.params.id, function (err, section) {
        if (err) {
            next(err);
        }
        else {
            if(!section) {
                return res.status(200).json({ message: "Provided section is not valid"}); 
            }
            section.name = req.body.name || section.name;
            section.description = req.body.description || section.description;
            
            section.save(function (err, updatedSection) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({message: "success", data: updatedSection})
                }
            })
        }
    })
}

exports.deleteSection = function(req, res, next){
    Section.findById(req.params.id, function (err, section) {
        if (err) {
            next(err);
        }
        else {
            if(!section) {
                return res.status(200).json({ message: "Provided section is not valid"}); 
            }
            Course.findById(section.course, function (err, result) {
                if (err) {
                    next(err);
                }
                else { //Delete section in the section list first
                    if(!result) {
                        return res.status(200).json({ message: "Provided course is not valid"}); 
                    }
                    result.sections.splice(result.sections.indexOf(section.id), 1)
                    result.save(function (err) {
                        if (err) {
                            next(err)
                        }
                        else { //then remove it from database
                            section.remove(function (err, deletedSection) {
                                if (err) {
                                    next(err);
                                }
                                else {
                                    res.status(200).json({message: "success", data : deletedSection})
                                }
                            })
                        }
                    })
                    
                }
            })
            
        }
    })
}