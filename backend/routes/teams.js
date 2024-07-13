const express = require('express');

const checkAuth = require('../middleware/check-auth');
const TeamsController = require('../controllers/teams');

const router = express.Router();

router.post('', checkAuth, TeamsController.addPlayersToTeam);
router.get('', checkAuth, TeamsController.getPlayers)
router.post('/addGameweek', checkAuth, TeamsController.addGameweek);
router.get('/getGameweek', checkAuth, TeamsController.getGameweek);
router.put('/:teamId', checkAuth, TeamsController.updatePlayers);

module.exports = router;
