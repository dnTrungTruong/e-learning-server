const User = require('../models/user.model')
const Notification = require('../models/notification.model')
const Constants = require('../helpers/constants');
const { Mongoose } = require('mongoose');

exports.getNotifications = function (req, res, next) {
    Notification.find({"users._id": res.locals.user.sub})
    // .select('performedBy target action date')
    .populate({ path: 'performedBy', select: ['_id', 'firstname', 'lastname']})
    .populate(
        [{
            path: 'target.course',
            model: 'Course',
            select: ['_id', 'name', 'type'],
        },
        {
            path: 'target.review',
            model: 'Review',
            populate: {
                path: 'course',
                model: 'Course',
                select: ['_id', 'name']
            }
        }]
    )
    .sort({date: -1})
    .exec(function (err, notifications) {
        if (err) {
            next(err);
        }
        else {
            if (!notifications.length) {
                return res.status(200).json({message: "No result" });
            }
            notifications.forEach((element, index, array) => {
                 let filteredUsers = element.users.filter(user => user._id == res.locals.user.sub);
                 element.users = filteredUsers;
            })
            
            res.status(200).json({message: "success", data: notifications });
        }
    });
}

exports.checkNotification = function (req, res, next) {
    Notification.updateOne(
        {_id: req.params.id}, 
        { $set: { "users.$[elem].checked" : true } },
        { arrayFilters: [ { "elem._id": res.locals.user.sub } ]},
        function(err, result) {
            if (err) {
                next(err);
            }
            else {
                return res.status(200).json({message: "success", data: result });
            }
        }
    )
}