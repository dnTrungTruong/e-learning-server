const Role = require('../helpers/role')
const User = require('../models/user.model')
const validate = require('../helpers/validationSchemas')
const SecretCode = require('../models/secretcode.model')
const cryptoRandomString = require('crypto-random-string')
const emailService = require('../helpers/emailService')

const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')




//create new user function
//birthday incorrect - need momentjs
exports.create = async function (req, res, next) {
    try{
        const user = new User(req.body);
        user.role = Role.Student;
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
        if (!user) return res.status(200).json({message: "Email or password is incorrect"});

        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) return res.status(200).json({message: "Email or password is incorrect"});
        
        const userData = user._doc;
        const token = jwt.sign({ sub: userData._id, role: userData.role }, config.secret);
        const { password, __v, ...userWithoutPassword } = userData;
        const authData = {
            'userdata': userWithoutPassword,
            'token': token
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

exports.authenticateWithPassport = async function (req, res, next) {

    try {
        const user = req.user;
        const userData = user._doc;
        const token = jwt.sign({ sub: userData._id, role: userData.role }, config.secret);
        const { password, __v, ...userWithoutPassword } = userData;
        const authData = {
            'userdata': userWithoutPassword,
            'token': token
        };
        res.status(200).json({message: "success", data: authData});
    }
    catch (err) {
        next(err)
    }
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
                res.status(200).json({ message: "No result" });
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
                res.status(200).json({ message: "Provided user is not valid" });
            }
            
        }
    })
}

exports.changePassword = async function (req, res, next) {
    try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(200).json({message: "Provided user is not valid"});

    //Need to change to use validation middleware here
    if (!(req.body.password && req.body.newPassword && req.body.newPasswordConfirm)) return res.status(200).json({message: "Please provide all needed information"});

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(200).json({message: "Current password is incorrect"});
    
    

    if (req.body.newPassword !== req.body.newPasswordConfirm) return res.status(200).json({message: "New password is not match"});

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt);
    user.password = hashedNewPassword;


    const savedUser = await user.save();
    res.status(200).json({message: "success"})

    } 
    catch(err) {
        next(err)
    }
}

exports.enrollCourse = function (req, res ,next) {
    //NEED TO CONFIRM BEFORE ADD TO COURSE
    User.findById(res.locals.user.sub, function (err, user) {
        if (err) {
            next(err);
        }
        else {
            if (user) {
                user.enrolledCourses.push(req.params.course_id);
            
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
                res.status(200).json({ message: "Provided user is not valid" });
            }
            
        }
    })
}

exports.sendVerifyMail = async function (req, res ,next) {
    const baseUrl = req.protocol + "://" + req.get("host");
    try {
        const user = await User.findById(res.locals.user.sub);

        if (!user) {
            res.json({ message: "This email is not associated with any account" });
        } else {
            if (user.isVerified) {
                return res.status(200).json({message: "Email have already been verified"})
            }
            await SecretCode.deleteMany({ email: user.email });

            const secretCode = cryptoRandomString({
                length: 6,
            });
            const newCode = new SecretCode({
                code: secretCode,
                email: user.email,
            });
            await newCode.save();

            const data = {
                from: config.EMAIL_USERNAME,
                to: user.email,
                subject: "Your Activation Link for YOUR APP",
                text: `Please use the following link within the next 10 minutes to activate your account on YOUR APP: ${baseUrl}/api/user/verify/${user._id}/${secretCode}`,
                html: `<p>Please use the following link within the next 10 minutes to activate your account on YOUR APP: <strong><a href="${baseUrl}/api/user/verify/${user._id}/${secretCode}" target="_blank">Verify link</a></strong></p>`,
            };
            await emailService.sendMail(data);

            res.status(200).json({ message: "success" });
        }
    } catch (err) {
        next(err);
    }
}

exports.verifyMail = async function (req, res, next) {
    try {
        const user = await User.findById(req.params.userId);
        const response = await SecretCode.findOne({
            email: user.email,
            code: req.params.secretCode,
        });

        if (!user) {
            res.status(200).json({message: "Provided information for verification is incorrect. Please check your link."})
        } else {
            if (!response) {
                return res.status(200).json({message: "Provided information for verification is incorrect. Please check your link."})
            }
            await User.updateOne(
                { email: user.email },
                { isVerified: true }
            );
            await SecretCode.deleteMany({ email: user.email });

            // let redirectPath;

            // if (process.env.NODE_ENV == "production") {
            //     redirectPath = `${req.protocol}://${req.get(
            //         "host"
            //     )}account/verified`;
            // } else {
            //     redirectPath = `http://127.0.0.1:8080/account/verified`;
            // }

            // res.redirect(redirectPath);
            res.status(200).json({message: "success"});
        }
    } catch (err) {
        next(err);
    }
}

exports.sendSecretCode = async function (req,res, next) {
    if (!req.body.email) { 
        res.status(200).json({ message: "Please provide your email address!" });
    } else {
        try {
            const user = await User.findOne({ email: req.body.email });

            if (!user || !user.isVerified) { 
                res.status(200).json({ message: "The provided email address is not registered!" });
            } else {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                const newCode = new SecretCode({
                    code: secretCode,
                    email: req.body.email,
                });
                await newCode.save();

                const data = {
                    from: config.EMAIL_USERNAME,
                    to: user.email,
                    subject: "Your Password Reset Code for YOUR APP",
                    text: `Please use the following code within the next 10 minutes to reset your password on YOUR APP: ${secretCode}`,
                    html: `<p>Please use the following code within the next 10 minutes to reset your password on YOUR APP: <strong>${secretCode}</strong></p>`,
                };
                await emailService.sendMail(data);

                res.status(200).json({message: "success"});
            }
        } catch (err) {
            next(err);
        }
    }
}

exports.verifySecretCode = async function (req, res, next) {
    const { email, password, password2, code } = req.body;

    if (!email || !password || !password2 || !code) {
        return res.status(200).json({message: "Please fill in all fields"});
    }
    if (password != password2) {
        return res.status(200).json({message: "Passwords do not match"});
    }
    
    // if (
    //     !password.match(
    //         /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/
    //     )
    // ) {
    //     errors.push({
    //         msg:
    //             "Your password must be at least 6 characters long and contain a lowercase letter, an uppercase letter, a numeric digit and a special character.",
    //     });
    // }
    try {
        const response = await SecretCode.findOne({ email, code });


        if (!response) {
            return res.status(200).json({message: "The entered code is not correct. Please make sure to enter the code in the requested time interval."});
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            await User.updateOne({ email }, { password: hashedPassword });
            await SecretCode.deleteOne({ email, code });
            res.status(200).json({message: "success"});
        }
    } catch (err) {
        next(err);
    }
}

exports.getUserByRole = function (role) {
    return [
        (req, res, next) => {
            User.find({ role: role }, function (err, result) {
                if (err) {
                    next(err);
                }
                else {
                    if (result.length) {
                        result.forEach(function removeUserPassword(user, index) {
                            const { password, __v, ...userWithoutPassword } = user._doc;
                            result[index]=userWithoutPassword 
                        })
                        res.status(200).json({message: "success", data: result });
                    }
                    else {
                        res.status(200).json({ message: "No result" });
                    }
                }
            })
        }
    ]
    
}