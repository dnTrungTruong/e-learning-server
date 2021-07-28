const Announcement = require('../models/announcement.model')
const Comment = require('../models/comment.model')
const Course = require('../models/course.model')
const Section = require('../models/section.model')
const User = require('../models/user.model')
const Notification = require('../models/notification.model')
const Constants = require('../helpers/constants')


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
        const enrolledUsers = await User.find({enrolledCourses: req.body.course}, {_id:1});
        const notification = new Notification({
            users: enrolledUsers,
            target: { course: req.body.course },
            performedBy: res.locals.user.sub,
            action: Constants.NOTIFICATION_ACTIONS.POST_ANNOUNCEMENT
        });
        //Save the notification
        await notification.save();
        //Save the announcement
        const savedAnnouncement = await announcement.save();
        return res.status(200).json({message: "success", data: savedAnnouncement});
    }
    catch(err) {
        next(err);
    }
}

exports.editAnnouncement = function (req, res ,next) {
    Announcement.findById(req.params.id, function (err, announcement) {
        if (err) {
            next(err);
        }
        else {
            if(!announcement) {
                return res.status(200).json({ message: "Provided announcement is not valid"}); 
            }
            announcement.title = req.body.title || announcement.title;
            announcement.content = req.body.content || announcement.content;
            
            announcement.save(function (err, updatedAnnouncement) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({message: "success", data: updatedAnnouncement})
                }
            })
        }
    })
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
