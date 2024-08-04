const express = require('express');

const checkAuth = require('../middleware/check-auth');
const TeamsController = require('../controllers/teams');

const router = express.Router();

router.post('', checkAuth, TeamsController.addPlayersToTeam);
router.get('', checkAuth, TeamsController.getPlayers)
router.post('/addGameweek', checkAuth, TeamsController.addGameweek);
router.get('/getGameweek', checkAuth, TeamsController.getGameweek);
router.put('/editGameweek/:weekNumber', checkAuth, TeamsController.editGameweek);
router.put('/:teamId', checkAuth, TeamsController.updatePlayers);
router.put('/addSubsequentGameweek/:teamId', checkAuth, TeamsController.addSubsequentGameweek);
router.put('/deleteGameweek/:teamId', checkAuth, TeamsController.deleteGameweek);
router.delete('/deleteOnlyGameweek/:teamId', checkAuth, TeamsController.deleteOnlyGameweek);

module.exports = router;
