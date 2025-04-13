const express = require('express');
const router = express.Router();
const actions = require('../api/actions');

router.post('/registration', actions.registration);
router.post('/login', actions.login);

module.exports = router;
