const express = require('express');

const checkAuth = require('../middleware/check-auth');
const TeamsController = require('../controllers/posts');
const ExtractFile = require('../middleware/file');

const router = express.Router();

router.post('', checkAuth, ExtractFile, TeamsController.createTeam)

router.put('/:postId', checkAuth, ExtractFile, TeamsController.updateTeam);

router.get('', checkAuth, TeamsController.getTeams);

router.get('/:id', TeamsController.getTeamById);

router.delete('/:id', checkAuth, TeamsController.deleteTeam);

module.exports = router;
