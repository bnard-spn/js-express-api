const express = require('express');
const router = express.Router();

router.get("/", (req, res) =>{
    res.status(200).json({ status: "SUCCESS", msg: 'Show all keyblades' });
});

module.exports = router;