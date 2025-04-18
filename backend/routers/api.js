const express = require("express");
const router = express.Router();
const actions = require("../api/actions");
const verifyToken = require("../middleware/verifyToken");

// Auth
router.post("/registration", actions.registration);
router.post("/login", actions.login);
router.post("/refreshToken", verifyToken, actions.refreshToken);

// Profil
router.post("/editProfile/:id", verifyToken, actions.editProfile);
router.get("/getProfile", verifyToken, actions.getProfile);

// Projekty
router.post("/projects", verifyToken, actions.createProject);
router.get("/projects", verifyToken, actions.getUserProjects);
router.get("/project/:projectId", verifyToken, actions.getProject);

// Tworzenie grupy / kolumny / zadania
router.post("/project/:projectId/groups", verifyToken, actions.createGroup);
router.post("/project/:projectId/groups/:groupId/columns", verifyToken, actions.createColumn);
router.post("/project/:projectId/groups/:groupId/columns/:columnId/tasks", verifyToken, actions.createTask);

// Usuwanie grupy / kolumny / zadania
router.delete('/project/:projectId/groups/:groupId', verifyToken, actions.deleteGroup);
router.delete('/project/:projectId/groups/:groupId/columns/:columnId', verifyToken, actions.deleteColumn);
router.delete('/project/:projectId/groups/:groupId/columns/:columnId/tasks/:taskId', verifyToken, actions.deleteTask);

module.exports = router;
