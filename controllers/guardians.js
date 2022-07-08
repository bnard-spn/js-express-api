const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const uuid = require('uuid');
const Guardian = require('../models/Guardian');


//@desc     Get all guardians
//@route    GET /api/v1/guardians
//@access   Public
exports.getGuardians = asyncHandler(async (req, res, next) => {
    let query;

    //Copy req.query
    const reqQuery = { ...req.query };

    //Create query string
    let queryStr = JSON.stringify(req.query);

    //Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //Finding resource
    query = Guardian.find(JSON.parse(queryStr));

    //Execute query
    const guardians = await query;

    if (guardians.length === 0) {
        return next(new ErrorResponse("Guardian not found", 404, "NOT_FOUND"));
    }

    res.status(200).json(guardians);
});

//@desc     Get single guardian
//@route    GET /api/v1/guardians/:id
//@access   Public
exports.getGuardian = asyncHandler(async (req, res, next) => {
    const guardianList = await Guardian.find().byGuardianId(req.params.id);

    if (guardianList.length === 0) {
        return next(new ErrorResponse("Guardian not found", 404, "NOT_FOUND"));
    }

    const guardian = guardianList[0];

    res.status(200).json(guardian);
});

//@desc     Add new guardian
//@route    POST /api/v1/guardians
//@access   Private
exports.createGuardian = asyncHandler(async (req, res, next) => {
    const guardianRequest = req.body;
    guardianRequest.guardianId = uuid.v4();
    const guardian = await Guardian.create(guardianRequest);
    res
        .status(201)
        .json({
            status: "CREATED",
            message: 'Added new guardian',
            guardian: guardian
        });
});

//@desc     Replace guardian
//@route    PUT /api/v1/guardians/:id
//@access   Private
exports.replaceGuardian = asyncHandler(async (req, res, next) => {
    const guardianRequest = req.body;
    guardianRequest.guardianId = req.params.id;
    const guardian = await Guardian.findOneAndReplace({ guardianId: req.params.id }, guardianRequest, {
        new: true,
        runValidators: true
    });

    if (!guardian) {
        return next(new ErrorResponse("Guardian not found", 404, "NOT_FOUND"));
    }

    res.status(200).json({
        status: "SUCCESS",
        message: "Guardian data is replaced",
        guardian: guardian
    });
});

//@desc     Update guardian
//@route    PATCH /api/v1/guardians/:id
//@access   Private
exports.updateGuardian = asyncHandler(async (req, res, next) => {
    if (req.body.hasOwnProperty('guardianId')) {
        return next(new ErrorResponse("'guardianId' cannot be updated", 400, "BAD_REQUEST"));
    }

    const guardian = await Guardian.findOneAndUpdate({ guardianId: req.params.id }, req.body, {
        new: true,
        runValidators: true
    });

    if (!guardian) {
        return next(new ErrorResponse("Guardian not found", 404, "NOT_FOUND"));
    }

    res.status(200).json({
        status: "SUCCESS",
        message: "Guardian data is updated",
        guardian: guardian
    });
});

//@desc     Delete guardian
//@route    DELETE /api/v1/guardians/:id
//@access   Private
exports.deleteGuardian = asyncHandler(async (req, res, next) => {
    const guardian = await Guardian.findOneAndDelete({ guardianId: req.params.id });

    if (!guardian) {
        return next(new ErrorResponse("Guardian not found", 404, "NOT_FOUND"));
    }

    res.status(200).json({
        status: "DELETED",
        message: "Guardian data is deleted"
    });
});