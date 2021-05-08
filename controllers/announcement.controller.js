const Announcement = require('../models/announcement.model')
const Comment = require('../models/comment.model')
const Course = require('../models/course.model')
const Section = require('../models/section.model')
const Constants = require('../helpers/constants')

// exports.getCommentsWithAnnouncementId = function (req, res, next) {
//     Comment.find({announcement: req.params.id})
//     .populate({ path: 'user', select: ['_id', 'firstname', 'lastname']})
//     .populate({ path: 'replies.user', select: ['_id', 'firstname', 'lastname']})
//     .sort({date: -1})
//     .exec(function (err, comment) {
//         if (err) {
//             next(err);
//         }
//         else {
//             if (!comment) {
//                 return res.status(200).json({message: "No result" });
//             }
//             res.status(200).json({message: "success", data: comment });
//         }
//     });
// }

exports.getAnnouncementsWithCourseId = function (req, res, next) {
    Announcement.find({course: req.params.id})
    .populate({ path: 'user', select: ['_id', 'firstname', 'lastname']})
    .populate({
        path: 'comments',
        model: 'Comment',
        populate: [{
            path: 'replies.user',
            model: 'User',
            select: ['_id', 'firstname', 'lastname']
        },
        {
            path: 'user',
            model: 'User',
            select: ['_id', 'firstname', 'lastname']
        }]
    })
    .sort({date: -1})
    .exec(function (err, announcement) {
        if (err) {
            next(err);
        }
        else {
            if (!announcement) {
                return res.status(200).json({message: "No result" });
            }
            res.status(200).json({message: "success", data: announcement });
        }
    });
}

exports.createAnnouncement = async function(req, res, next){
    try {
        const announcement = new Announcement({
            title: req.body.title,
            course: req.body.course,
            user: res.locals.user.sub,
            content: req.body.content
        });
        const course = await Course.findById(req.body.course);
        if (course.type === Constants.COURSE_TYPES.ONLINE) {
            if (!req.body.section) {
                return res.status(200).json({message: "Section is required"});
            }
            const updatedSection = await Section.updateOne({ _id: req.body.section }, {
                "$push": {
                    "announcements": announcement._id
                }
            });
        }
        //Save the announcement
        const savedAnnouncement = await announcement.save();

        return res.status(200).json({message: "success", data: savedAnnouncement});
    }
    catch(err) {
        next(err);
    }
}

exports.postComment = async function(req, res, next){
    try {
        const comment = new Comment({
            user: res.locals.user.sub,
            content: req.body.content
        });
        //Save the announcement
        const savedComment = await comment.save();

        const updatedAnnouncement = await Announcement.updateOne({ _id: req.params.id }, {
            "$push": {
                "comments": savedComment._id
            }
        });

        return res.status(200).json({message: "success", data: updatedAnnouncement});
    }
    catch(err) {
        next(err);
    }
}

exports.replyComment =  function (req, res ,next) {
    Comment.updateOne({ _id: req.params.id }, 
        {
            "$push": {
                "replies": {
                    content: req.body.content,
                    user: res.locals.user.sub,
                    date: Date.now()
                }
            }
        }, function (err, updatedComment) {
        if (err){
            next(err);
        }
        else{
            return res.status(200).json({message: "success", data: updatedComment});
        }
    });
}


exports.deleteAnnouncement = async function(req, res, next){
    try {
        const deletedAnnouncement = await Announcement.deleteOne({ _id: req.params.id});
        res.status(200).json({message: "success", data : deletedAnnouncement})
    }
    catch(err) {
        next(err);
    }
   
}