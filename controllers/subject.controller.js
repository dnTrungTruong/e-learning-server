const Subject = require('../models/subject.model')

exports.createSubject = function(req, res, next){
    const subject = new Subject(req.body);

    subject.save(function (err, createdSubject) {
        if (err) {
            next(err)
        }
        else {
            res.status(200).json({data: createdSubject})
        }
    })
}

exports.getSubjectInfo = function (req, res, next) {
    Subject.findById(req.params.id, function (err, subject) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ data: subject });
        }
    });
}

exports.getSubjectList = function (req, res ,next){
    Subject.find(function(err, result) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ data: result });
        }
    })
}

exports.getSubjectList = function (req, res ,next){
    Subject.find(function(err, result) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ data: result });
        }
    })
}

exports.editSubject = function (req, res ,next) {
    Subject.findById(req.params.id, function (err, subject) {
        if (err) {
            next(err);
        }
        else {
            subject.name = req.body.name || subject.name;
            
            subject.save(function (err, updatedSubject) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({data: updatedSubject})
                }
            })
        }
    })
}

exports.deleteSubject = function(req, res, next){
    Subject.findById(req.params.id, function (err, subject) {
        if (err) {
            next(err);
        }
        else {
            subject.remove(function (err, deletedSubject) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({data : deletedSubject})
                }
            })
        }
    })
}