const ErrorResponse = require('../utils/errorResponse')
const uuid = require('uuid');
const Guardian = require('../models/Guardian');


//@desc     Get all guardians
//@route    GET /api/v1/guardians
//@access   Public
exports.getGuardians = async (req, res, next) => {
    try {
        const guardians = await Guardian.find();

        res.status(200).json(guardians);
    } catch (error) {
        next(error);
    }
}

//@desc     Get single guardian
//@route    GET /api/v1/guardians/:id
//@access   Public
exports.getGuardian = async (req, res, next) => {
    try {
        const guardianList = await Guardian.find().byGuardianId(req.params.id);

        if (guardianList.length === 0) {
            return next(new ErrorResponse("Guardian not found", 404, "NOT_FOUND"));
        }

        const guardian = guardianList[0];

        res.status(200).json(guardian);
    } catch (error) {
        next(error);
    }
}

//@desc     Add new guardian
//@route    POST /api/v1/guardians
//@access   Private
exports.createGuardian = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error);
    }
}

//@desc     Replace guardian
//@route    PUT /api/v1/guardians/:id
//@access   Private
exports.replaceGuardian = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error);
    }
}

//@desc     Update guardian
//@route    PATCH /api/v1/guardians/:id
//@access   Private
exports.updateGuardian = async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error);
    }
}

//@desc     Delete guardian
//@route    DELETE /api/v1/guardians/:id
//@access   Private
exports.deleteGuardian = async (req, res, next) => {
    try {
        const guardian = await Guardian.findOneAndDelete({ guardianId: req.params.id });

        if (!guardian) {
            return next(new ErrorResponse("Guardian not found", 404, "NOT_FOUND"));
        }

        res.status(200).json({
            status: "DELETED",
            message: "Guardian data is deleted"
        });
    } catch (error) {
        next(error);
    }
}