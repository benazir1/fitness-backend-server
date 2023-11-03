const router = require('express').Router();
let Warmup = require('../models/warmup');

router.route('/all').get((req, res) => {
  Warmup.find()
    .then(warmup => res.json(warmup))
    .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;