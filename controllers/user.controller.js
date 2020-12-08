const Role = require('../helpers/role')
const User = require('../models/user.model')
const validate = require('../helpers/validationSchemas')
const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')




//create new user function
//birthday incorrect - need momentjs
exports.create = async function (req, res, next) {
    const user = new User(req.body);

    try{

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;

        const createdUser = await user.save();
        res.status(200).json({message: "success", data: createdUser})
    }catch (err) {
        next(err);
    }
    

    //Hash password
    // bcrypt.genSalt(10, function (err, salt) {
    //     if (err) {
    //         next(err);
    //     }
    //     else {
    //         bcrypt.hash(user.password, salt, function (err, hashedPassword) {
    //             if (err) {
    //                 next(err);
    //             }
    //             else {
    //                 user.password= hashedPassword;
    //                 user.save(function (err, createdUser) {
    //                     if (err) {
    //                         next(err)
    //                     }
    //                     else {
    //                         res.status(200).json({data: createdUser})
    //                     }
    //                 })
    //             }
    //         })
    //     }
    // })

    
}

//authenticate user
exports.authenticate = async function (req, res, next) {

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({message: "Email or password is incorrect"});

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) return res.status(400).json({message: "Email or password is incorrect"});
        
        const userData = user._doc;
        const token = jwt.sign({ sub: userData._id, role: userData.role }, config.secret);
        const { password, __v, ...userWithoutPassword } = userData;
        const authData = {
            'data': userWithoutPassword,
            token
        };
        res.status(200).json({message: "success", data: authData});
    }
    catch (err) {
        next(err)
    }

    // User.findOne({ email: email }, function (err, result) {
    //     if (err) {
    //         next(err);
    //     }
    //     else {
    //         if (result) {
    //             bcrypt.compare(password, result.password, function (err, success) {
    //                 if (err) {
    //                     next(err);
    //                 }
    //                 else {
    //                     if (success) {
    //                     const user = result._doc;
    //                     const token = jwt.sign({ sub: user._id, role: user.role }, config.secret);
    //                     const { password, __v, ...userWithoutPassword } = user;
    //                     const authData = {
    //                         'data': userWithoutPassword,
    //                         token
    //                     };

    //                     res.status(200).json(authData);
    //                     }
    //                     else {
    //                         res.status(400).json({ message: 'Email or password is incorrect' })
    //                     }
    //                 }
    //             })
    //         }
    //         else {
    //             res.status(400).json({ message: 'Email or password is incorrect' })
    //         }
    //     }
    // })

}

//get user info
exports.getUserInfo = function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            next(err);
        }
        else {
            if (user) {
                const { password, __v, ...userWithoutPassword } = user._doc;
                res.status(200).json({message: "success", data: userWithoutPassword });
            }
            else {
                res.status(404).json({ message: "No result" });
            }
        }
    });
}

exports.editInfo = function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            next(err);
        }
        else {
            if (user) {
                user.firstname = req.body.firstname || user.firstname;
                user.lastname = req.body.lastname || user.lastname;
                user.birthday = req.body.birthday || user.birthday;

                user.save(function (err, updatedUser) {
                    if (err) {
                        next(err);
                    }
                    else {
                        res.status(200).json({message: "success", data: updatedUser})
                    }
                })
            }
            else {
                res.status(404).json({ message: "No result" });
            }
            
        }
    })
}

exports.getUserByRole = function (role) {
    return [
        (req, res, next) => {
            User.find({ role: role }, function (err, result) {
                if (err) {
                    next(err);
                }
                else {
                    if (result) {
                        result.forEach(function removeUserPassword(user, index) {
                            const { password, __v, ...userWithoutPassword } = user._doc;
                            result[index]=userWithoutPassword 
                        })
                        res.status(200).json({message: "success", data: result });
                    }
                    else {
                        res.status(404).json({ message: "No result" });
                    }
                }
            })
        }
    ]
    
}

// exports.getStudentList = function (req, res, next) {
//     User.find({ role: Role.Student }, function (err, result) {
//         if (err) {
//             next(err);
//         }
//         else {
//             if (result) {
//                 result.forEach(removeUserPassword)
//                 res.status(200).json({message: "success", data: result });
//             }
//             else {
//                 res.status(404).json({ message: "No result" });
//             }
//         }
//     })
// }

// exports.getInstructorList = function (req, res, next) {
//     User.find({ role: Role.Instructor }, function (err, result) {
//         if (err) {
//             next(err);
//         }
//         else {
//             result.forEach(removeUserPassword)
//             res.status(200).json({message: "success", data: result });
//         }
//     })
// }

// exports.getModeratorList = function (req, res, next) {
//     User.find({ role: Role.Moderator }, function (err, result) {
//         if (err) {
//             next(err);
//         }
//         else {
//             result.forEach(removeUserPassword)
//             res.status(200).json({message: "success", data: result });
//         }
//     })
// }

