const mongoose = require('mongoose');
const nameRegex = "^[a-zA-Z '-]*$";
const descRegex = "^[a-zA-Z0-9 '.-]*$";

const KeybladeSchema = new mongoose.Schema(
    {
        keybladeId: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        keyblade: {
            type: String,
            required: [true, "'keyblade' is required"],
            trim: true,
            maxLength: [50, "Max length reached for 'keyblade'"],
            validate: [new RegExp(nameRegex), "Invalid field value for 'keyblade'"]
        },
        firstAppearance: {
            type: String,
            required: [true, "'firstAppearance' is required"],
            trim: true,
            maxLength: [50, "Max length reached for 'firstAppearance'"],
            validate: [new RegExp(descRegex), "Invalid field value for 'firstAppearance'"]
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        query: {
            byKeybladeId(id) {
                return this.where({
                    keybladeId: id
                });
            }
        },
        strict: "throw"
    }
);

KeybladeSchema.post(['findOneAndReplace', 'findOneAndUpdate'], function (error, res, next) {
    next();
});

KeybladeSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj._id;
    delete obj.__v;
    return obj
};

module.exports = mongoose.model('Keyblade', KeybladeSchema);