const express = require('express');
const {
    getKeyblades,
    getKeyblade,
    createKeyblade,
    replaceKeyblade,
    updateKeyblade,
    deleteKeyblade
} = require('../controllers/keyblades');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getKeyblades)
    .post(protect, authorize('publisher', 'user'), createKeyblade);

router
    .route('/:id')
    .get(getKeyblade)
    .put(protect, authorize('publisher'), replaceKeyblade)
    .patch(protect, authorize('publisher'), updateKeyblade)
    .delete(protect, authorize('publisher'), deleteKeyblade);

module.exports = router;