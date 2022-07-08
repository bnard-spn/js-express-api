const express = require('express');
const {
    getGuardians,
    getGuardian,
    createGuardian,
    replaceGuardian,
    updateGuardian,
    deleteGuardian
} = require('../controllers/guardians');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getGuardians)
    .post(protect, authorize('publisher', 'user'), createGuardian);

router
    .route('/:id')
    .get(getGuardian)
    .put(protect, authorize('publisher'), replaceGuardian)
    .patch(protect, authorize('publisher'), updateGuardian)
    .delete(protect, authorize('publisher'), deleteGuardian);

module.exports = router;