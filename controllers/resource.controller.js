const Resource = require('../models/resource.model')
const Lecture = require('../models/lecture.model')


exports.createResource = function(req, res, next){
    
    const resource = new Resource(req.body);
    //Need validation
    resource.save(function (err, createdResource) { 
        if (err) {
            next(err)
        }
        else { //After saved, add Resource to the index position resources list in course by using splice()
            Lecture.findById(createdResource.lecture, function (err, result) {
                if (err) {
                    next (err);
                }
                else {
                    //insert or append to resources list depend on index
                    if (req.params.index) {
                        result.resources.splice(req.params.index, 0, createdResource._id);
                    }
                    else {
                        result.resources.push(createdResource._id);
                    }

                    result.save(function (err) {
                        if (err) {
                            next(err);
                        }
                        else {
                            res.status(200).json({data: createdResource})
                        }
                    })

                }
            })
        }
    })  
}

// exports.getResourceInfo = function (req, res, next) {
//     Resource.findById(req.params.id, function (err, resource) {
//         if (err) {
//             next(err);
//         }
//         else {
//             res.status(200).json({ data: resource });
//         }
//     });
// }

exports.getResourcesByLecture = function (req, res ,next){
    Lecture.findById(req.params.id)
    .populate('resources')
    .exec(function(err, result) {
        if (err) {
            next(err);
        }
        else {
            if (!result.length) {
                return res.status(200).json({ message: "No result"}); 
            }
            res.status(200).json({ data: result.resources });
        }
    })
}


exports.editResources = function (req, res ,next) {
    Resource.findById(req.params.id, function (err, resource) {
        if (err) {
            next(err);
        }
        else {
            if (!resource){
                return res.status(200).json({ message: "Provided resource is not valid"}); 
            }
            resource.name = req.body.name || resource.name;
            resource.url = req.body.url || resource.url;

            resource.save(function (err, updatedResource) {
                if (err) {
                    next(err);
                }
                else {
                    res.status(200).json({data: updatedResource})
                }
            })
        }
    })
}

exports.deleteResource = function(req, res, next){
    Resource.findById(req.params.id, function (err, resource) {
        if (err) {
            next(err);
        }
        else {
            Lecture.findById(resource.lecture, function (err, result) {
                if (err) {
                    next(err);
                }
                else { //Delete resouce in the resources list first
                    result.resources.splice(result.resources.indexOf(resource.id), 1)
                    result.save(function (err) {
                        if (err) {
                            next(err)
                        }
                        else { //then remove it from database
                            resource.remove(function (err, deletedResource) {
                                if (err) {
                                    next(err);
                                }
                                else {
                                    res.status(200).json({data : deletedResource})
                                }
                            })
                        }
                    })

                }
            })

        }
    })
}