const mongoose = require('mongoose');
const nameRegex = "^[a-zA-Z '-]*$";

const GuardianSchema = new mongoose.Schema(
    {
        guardianId: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String,
            required: [true, "'firstName' is required"],
            trim: true,
            maxLength: [50, "Max length reached for 'firstName'"],
            validate: [new RegExp(nameRegex), "Invalid field value for 'firstName'"]
        },
        lastName: {
            type: String,
            required: [true, "'lastName' is required"],
            trim: true,
            maxLength: [50, "Max length reached for 'lastName'"],
            validate: [new RegExp(nameRegex), "Invalid field value for 'lastName'"]
        },
        keyblade: {
            type: String,
            required: [true, "'keyblade' is required"],
            trim: true,
            maxLength: [50, "Max length reached for 'keyblade'"],
            validate: [new RegExp(nameRegex), "Invalid field value for 'keyblade'"]
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        query: {
            byGuardianId(id) {
                return this.where({
                    guardianId: id
                });
            }
        },
        strict: "throw"
    }
);

GuardianSchema.post(['findOneAndReplace', 'findOneAndUpdate'], function (error, res, next) {
    next();
});

GuardianSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    return obj
};

module.exports = mongoose.model('Guardian', GuardianSchema);