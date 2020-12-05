module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }
    if (err.name === 'MongoError') {
        if (err.code === 11000) {
            return res.status(401).json({message: 'Email is already exist'})
        }
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}