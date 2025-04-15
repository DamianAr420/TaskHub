const express = require('express');
const router = express.Router();
const actions = require('../api/actions');
const verifyToken = require('../middleware/verifyToken');

router.post('/registration', actions.registration);
router.post('/login', actions.login);

router.post('/editProfile/:id', verifyToken, actions.editProfile);
router.get('/getProfile', verifyToken, actions.getProfile);
router.post('/projects', verifyToken, actions.createProject);
router.post('/projects/:projectId/tasks', verifyToken, actions.addTask);
router.post('/projects/:projectId/tasks/move', verifyToken, actions.moveTask);
router.get('/projects', verifyToken, actions.getUserProjects);

module.exports = router;
