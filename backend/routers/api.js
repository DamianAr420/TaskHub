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
router.get('/project/:projectId', verifyToken, actions.getProject);
router.post('/refreshToken', verifyToken, actions.refreshToken);
router.post('/project/:projectId/groups', verifyToken, actions.createGroup);
router.post('/project/:projectId/groups/:groupId/columns', verifyToken, actions.createColumn);
router.post('/project/:projectId/groups/:groupId/columns/:columnId/tasks', verifyToken, actions.createTask);
module.exports = router;
