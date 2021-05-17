const Review = require('../models/review.model')
const Course = require('../models/course.model')

exports.createReview = async function(req, res, next){
    try {
        const review = new Review({
            course: req.body.course,
            user: res.locals.user.sub,
            rate: req.body.rate,
            content: req.body.content
        });
        //Check if user have made any review before
        const check = await Review.findOne({user: review.user});
        if (check) return next("User have already made a review for this course.");
        //Save the review
        const savedReview = await review.save();
        //Calculate new course rate, increase reviewNumbers and save it
        const reviews = await Review.find({ course: req.body.course });
        const avg = avgRate(reviews);

        await Course.updateOne({ _id: req.body.course },
            {
                $set: {
                    avgRate: avg, reviewsNumber: reviews.length
                }
            }
        );
        return res.status(200).json({message: "success", data: savedReview});
    }
    catch(err) {
        next(err);
    }
}

exports.getReviewsWithCourseId = function (req, res, next) {
    Review.find({course: req.params.id})
    .populate({ path: 'user', select: ['_id', 'firstname', 'lastname']})
    .populate({ path: 'reply.user', select: ['firstname', 'lastname']})
    .sort({date: -1})
    .exec(function (err, reviews) {
        if (err) {
            next(err);
        }
        else {
            if (!reviews.length) {
                return res.status(200).json({message: "No result" });
            }
            res.status(200).json({message: "success", data: reviews });
        }
    });
}

exports.replyReview = function (req, res ,next) {
    Review.findById(req.params.id, function (err, review) {
        if (err) {
            next(err);
        }
        else {
            if (!review) {
                return res.status(200).json({message: "Provided review is not valid" });
            }
            //if(review.reply) return true; //even when console.log(review.reply) //{}
            if (review.reply.user) return next("You have already replied this review.");
            review.reply.user = res.locals.user.sub;
            review.reply.content = req.body.content;
            review.reply.date = req.body.date;

            review.save(function (err, updatedReview) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({message: "success", data: updatedReview})
                }
            })
        }
    })
}


exports.deleteReview = async function(req, res, next){
    try {
        const deletedReview = await Review.deleteOne({ _id: req.params.id});
        const reviews = await Review.find({ course: deletedReview.course });
        const avg = avgRate(reviews);
        await Course.updateOne({ _id: deletedReview.course},
            {
                $set: {
                    avgRate: avg, numberRate: rates.length
                }
            });
        res.status(200).json({message: "success", data : deletedReview})
    }
    catch(err) {
        next(err);
    }
   
}

function avgRate(array) {
    let sum = 0;
    const length = array.length;
    if (length == 0)
        return 0;
    for (let i = length - 1; i >= 0; i--) {
        sum += array[i].rate;
    }
    return (sum / length).toFixed(2);
}
