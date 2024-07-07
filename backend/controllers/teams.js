const PlayersArray = require('../models/playersArray');
const Gameweek = require('../models/gameweek');

exports.addPlayersToTeam = (req, res, next) => {
  const players = new PlayersArray({
    teamId: req.body.teamId,
    players: req.body.players,
  });
  players.save()
    .then((createdPost) => {
      res.status(201).json({
        message: 'players added successfully!',
        post: {
          teamId: createdPost.teamId,
          players: req.body.players,
        }
      })
    })
    .catch(error => {
      res.status(500).json({
        message: 'adding players failed!'
      });
    });

};

exports.getPlayers = (req, res, next) => {
  const postQuery = PlayersArray.find();
  postQuery
    .then(data => {
      res.status(200).json({
        message: 'players fetched successfully!',
        players: data
      });
    }
    )
    .catch(error => {
      res.status(500).json({
        message: 'fetching posts failed!'
      });
    });
};

exports.addGameweek = (req, res, next) => {
  const gameweek = new Gameweek({
    teamId: req.body.team_id,
    weeksArray: req.body.weeksArray
  });
  gameweek.save()
    .then((createdPost) => {
      res.status(201).json({
        message: 'gameweek added successfully!',
        post: {
          teamId: createdPost.teamId,
        }
      })
    })
    .catch(error => {
      res.status(500).json({
        message: 'adding gameweek failed!'
      });
    });

};

exports.getGameweek = (req, res, next) => {
  const postQuery = Gameweek.find();
  postQuery
    .then(data => {
      res.status(200).json({
        message: 'gameweek fetched successfully!',
        data: data
      });
    }
    )
    .catch(error => {
      res.status(500).json({
        message: 'fetching posts failed!'
      });
    });
};

