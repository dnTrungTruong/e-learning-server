const Section = require('../models/section.model')

exports.createSection = function(req, res, next){
    const section = new Section(req.body);

    section.save(function (err, createdSection) {
        if (err) {
            next(err)
        }
        else {
            res.status(200).json({data: createdSection})
        }
    })
}

exports.getSectionInfo = function (req, res, next) {
    Section.findById(req.params.id, function (err, section) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ data: section });
        }
    });
}

exports.getSectionList = function (req, res ,next){
    Section.find({course: req.params.id}, function(err, result) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ data: result });
        }
    })
}


exports.editSection = function (req, res ,next) {
    Section.findById(req.params.id, function (err, section) {
        if (err) {
            next(err);
        }
        else {
            section.name = req.body.name || section.name;
            
            section.save(function (err, updatedSection) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({data: updatedSection})
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
            section.remove(function (err, deletedSection) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({data : deletedSection})
                }
            })
        }
    })
}