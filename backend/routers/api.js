const express = require('express');
const router = express.Router();
const actions = require('../api/actions');
const verifyToken = require('../middleware/verifyToken');

router.post('/registration', actions.registration);
router.post('/login', actions.login);

router.get('/getProfile', verifyToken, actions.getProfile);
router.post('/editProfile', verifyToken, actions.editProfile);

module.exports = router;
