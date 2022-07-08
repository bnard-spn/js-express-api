const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const uuid = require('uuid');
const Keyblade = require('../models/Keyblade');

//@desc     Get all keyblades
//@route    GET /api/v1/keyblades
//@access   Public
exports.getKeyblades = asyncHandler(async (req, res, next) => {
    let query;

    //Copy req.query
    const reqQuery = { ...req.query };

    //Create query string
    let queryStr = JSON.stringify(req.query);

    //Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    //Finding resource
    query = Keyblade.find(JSON.parse(queryStr));

    //Execute query
    const keyblades = await query;

    if (keyblades.length === 0) {
        return next(new ErrorResponse("Keyblade not found", 404, "NOT_FOUND"));
    }

    res.status(200).json(keyblades);
});

//@desc     Get single keyblade
//@route    GET /api/v1/keyblades/:id
//@access   Public
exports.getKeyblade = asyncHandler(async (req, res, next) => {
    const keybladeList = await Keyblade.find().byKeybladeId(req.params.id);

    if (keybladeList.length === 0) {
        return next(new ErrorResponse("Keyblade not found", 404, "NOT_FOUND"));
    }

    const keyblade = keybladeList[0];

    res.status(200).json(keyblade);
});

//@desc     Add new keyblade
//@route    POST /api/v1/keyblades
//@access   Private
exports.createKeyblade = asyncHandler(async (req, res, next) => {
    const keybladeRequest = req.body;
    keybladeRequest.keybladeId = uuid.v4();
    const keyblade = await Keyblade.create(keybladeRequest);
    res
        .status(201)
        .json({
            status: "CREATED",
            message: 'Added new keyblade',
            keyblade: keyblade
        });
});

//@desc     Replace keyblade
//@route    PUT /api/v1/keyblades/:id
//@access   Private
exports.replaceKeyblade = asyncHandler(async (req, res, next) => {
    const keybladeRequest = req.body;
    keybladeRequest.keybladeId = req.params.id;
    const keyblade = await Keyblade.findOneAndReplace({ keybladeId: req.params.id }, keybladeRequest, {
        new: true,
        runValidators: true
    });

    if (!keyblade) {
        return next(new ErrorResponse("Keyblade not found", 404, "NOT_FOUND"));
    }

    res.status(200).json({
        status: "SUCCESS",
        message: "Keyblade data is replaced",
        keyblade: keyblade
    });
});

//@desc     Update keyblade
//@route    PATCH /api/v1/keyblades/:id
//@access   Private
exports.updateKeyblade = asyncHandler(async (req, res, next) => {
    if (req.body.hasOwnProperty('keybladeId')) {
        return next(new ErrorResponse("'keybladeId' cannot be updated", 400, "BAD_REQUEST"));
    }

    const keyblade = await Keyblade.findOneAndUpdate({ keybladeId: req.params.id }, req.body, {
        new: true,
        runValidators: true
    });

    if (!keyblade) {
        return next(new ErrorResponse("Keyblade not found", 404, "NOT_FOUND"));
    }

    res.status(200).json({
        status: "SUCCESS",
        message: "Keyblade data is updated",
        keyblade: keyblade
    });
});

//@desc     Delete keyblade
//@route    DELETE /api/v1/keyblades/:id
//@access   Private
exports.deleteKeyblade = asyncHandler(async (req, res, next) => {
    const keyblade = await Keyblade.findOneAndDelete({ keybladeId: req.params.id });

    if (!keyblade) {
        return next(new ErrorResponse("Keyblade not found", 404, "NOT_FOUND"));
    }

    res.status(200).json({
        status: "DELETED",
        message: "Keyblade data is deleted"
    });
});