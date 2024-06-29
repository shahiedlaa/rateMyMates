const express = require('express');

const checkAuth = require('../middleware/check-auth');
const TeamsController = require('../controllers/teams');

const router = express.Router();

router.post('', checkAuth, TeamsController.addPlayersToTeam);
router.get('', checkAuth, TeamsController.getPlayers)

module.exports = router;
