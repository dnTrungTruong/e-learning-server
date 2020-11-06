const Role = require('../helpers/role')
const User = require('../models/user.model')
const config = require('config.json');
const jwt = require('jsonwebtoken');


//create new user function
//password hash needed
//birthday incorrect - need momentjs
exports.create = function (req, res, next) {
    const user = new User(req.body);

    user.save(function (err, createdUser) {
        if (err) {
            next(err)
        }
        else {
            res.status(200).json({data: createdUser})
        }
    })
}

//authenticate user
exports.authenticate = async function (req, res, next) {

    const { email, password } = req.body;

    User.findOne({ email: email, password: password }, function (err, result) {
        if (err) {
            next(err);
        }
        else {
            if (result) {
                const user = result._doc;
                const token = jwt.sign({ sub: user._id, role: user.role }, config.secret);
                const { password, __v, ...userWithoutPassword } = user;
                const authData = {
                    'data': userWithoutPassword,
                    token
                };

                res.status(200).json(authData);
            }
            else {
                res.status(400).json({ message: 'Email or password is incorrect' })
            }
        }
    })

}

//get user info
exports.getUserInfo = function (req, res, next) {

    if (req.params.id == res.locals.user.sub || res.locals.user.role == Role.Admin) {
        User.findById(req.params.id, function (err, user) {
            if (err) {
                next(err);
            }
            else {
                const { password, __v, ...userWithoutPassword } = user._doc;
                res.status(200).json({ data: userWithoutPassword });
            }
        });
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

exports.editInfo = function (req, res, next) {

    if (req.params.id == res.locals.user.sub) {
        User.findById(req.params.id, function (err, user) {
            if (err) {
                next(err);
            }
            else {
                user.firstname = req.body.firstname || user.firstname;
                user.lastname = req.body.lastname || user.lastname;
                user.birthday = req.body.birthday || user.birthday;
    
                user.save(function (err, updatedUser) {
                    if (err) {
                        next(err);
                    }
                    else {
                        res.status(200).json({data: updatedUser})
                    }
                })
            }
        })
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

//get student list (include password - need fix)
exports.getStudentList = function (req, res, next) {
    User.find({ role: Role.Student }, function (err, result) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ data: result });
        }
    })
}

//get instructor list (include password - need fix)
exports.getInstructorList = function (req, res, next) {
    User.find({ role: Role.Instructor }, function (err, result) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ data: result });
        }
    })
}

//get moderator list (include password - need fix)
exports.getModeratorList = function (req, res, next) {
    User.find({ role: Role.Moderator }, function (err, result) {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json({ data: result });
        }
    })
}

