const mongoose = require('mongoose');

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
            maxLength: [50, "Max length reached for 'firstName'"]
        },
        lastName: {
            type: String,
            required: [true, "'lastName' is required"],
            trim: true,
            maxLength: [50, "Max length reached for 'lastName'"]
        },
        keyblade: {
            type: String,
            required: [true, "'keyblade' is required"],
            trim: true,
            maxLength: [50, "Max length reached for 'keyblade'"]
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        query: {
            byGuardianId(guardianId) {
                return this.where({
                    guardianId: new RegExp(guardianId, 'i')
                });
            }
        }
    }
);

module.exports = mongoose.model('Guardian', GuardianSchema);