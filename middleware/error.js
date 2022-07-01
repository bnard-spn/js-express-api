const ErrorResponse = require('../utils/errorResponse')
const errorHandler = (err, req, res, next) => {

    let error = { ...err }
    error.message = err.message;

    //Log to console for dev
    // console.log(err);

    //Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field for primary key entered';
        error = new ErrorResponse(message, 400, "BAD_REQUEST");
    }

    //Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors)[0].message;
        error = new ErrorResponse(message, 400, "BAD_REQUEST");
    }

    //Mongoose strict field
    if (err.name === 'StrictModeError') {
        const message = 'Invalid field input';
        error = new ErrorResponse(message, 400, "BAD_REQUEST");
    }

    res.status(error.statusCode || 500).json({
        status: error.status,
        message: error.message || 'SERVICE_UNAVAILABLE'
    });
};

module.exports = errorHandler;