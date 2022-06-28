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

router
    .route('/')
    .get(getGuardians)
    .post(createGuardian);

router
    .route('/:id')
    .get(getGuardian)
    .put(replaceGuardian)
    .patch(updateGuardian)
    .delete(deleteGuardian);

module.exports = router;