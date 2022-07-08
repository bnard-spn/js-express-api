const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const uuid = require('uuid');
const User = require('../models/User');

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, role } = req.body;

    const userId = uuid.v4();
    const apiKey = uuid.v4();

    //Create user
    const user = await User.create({
        name,
        userId,
        apiKey,
        role
    });

    //Create token
    const token = user.getSignedJwtToken();

    res.status(200).json({
        status: "CREATED",
        message: "User successfully created.",
        userId: userId,
        apiKey: apiKey
    })
});

//@desc     Get access token
//@route    GET /api/v1/auth/token
//@access   Public
exports.getToken = asyncHandler(async (req, res, next) => {
    const { user_id, api_key } = req.headers;

    // Validate user id and api key
    if (!user_id || !api_key) {
        return next(new ErrorResponse("'user_id' and 'api_key' headers are required.", 400, "BAD_REQUEST"));
    }

    // Check for user_id
    const user = await User.findOne({ userId: user_id }).select("+apiKey");

    if (!user) {
        return next(new ErrorResponse("Invalid access credentials", 401, "UNAUTHORIZED"));
    }

    // Check if apiKey matched
    const isMatch = await user.matchKey(api_key);

    if (!isMatch) {
        return next(new ErrorResponse("Invalid access credentials", 401, "UNAUTHORIZED"));
    }

    // Create token
    const token = user.getSignedJwtToken();
    res.status(200).json(
        {
            status: "ACCESS_GRANTED",
            token: token,
            expiry: parseInt(process.env.JWT_EXPIRE)
        }
    );
});