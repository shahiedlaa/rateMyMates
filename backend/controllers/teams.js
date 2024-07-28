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

exports.deleteGameweek = (req, res, next) => {
  const gameweek = new Gameweek({
    teamId: req.body.teamId,
    weeksArray: req.body.weeksArray
  });
  console.log(gameweek);
  Gameweek.updateOne({ teamId: req.params.teamId }, { $set: { teamId: req.body.teamId, weeksArray: req.body.weeksArray } })
    .then(result => {
      if (result.matchedCount > 0) {
        res.status(200).json({
          message: 'gameweek updated successfully!'
        });
      }
      else {
        res.status(401).json({
          message: 'update not authorized!'
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'updating gameweek failed!'
      });
    });
};

exports.deleteOnlyGameweek = (req, res, next) => {
  Gameweek.deleteOne({ teamId: req.params.teamId })
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: 'only gameweek deleted successfully!'
        });
      }
      else {
        res.status(401).json({
          message: 'only gameweek deletion not authorized!'
        })
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'deleting gameweek failed!'
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

exports.addSubsequentGameweek = (req, res, next) => {
  const gameweek = new Gameweek({
    teamId: req.body.teamId,
    weeksArray: req.body.weeksArray
  });

  Gameweek.updateOne({ teamId: req.params.teamId }, { $set: { teamId: req.body.teamId, weeksArray: req.body.weeksArray } })
    .then(result => {
      if (result.matchedCount > 0) {
        res.status(200).json({
          message: 'gameweek updated successfully!'
        });
      }
      else {
        res.status(401).json({
          message: 'update not authorized!'
        });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'updating gameweek failed!'
      });
    });
};



exports.updatePlayers = (req, res, next) => {
  const players = new PlayersArray({
    _id: req.body.id,
    teamId: req.params.teamId,
    players: req.body.players
  });

  PlayersArray.updateOne({ teamId: req.params.teamId }, players)
    .then(result => {
      if (result.matchedCount > 0) {
        res.status(200).json({
          message: 'team updated successfully!'
        });
      }
      else {
        res.status(401).json({
          message: 'update not authorized!'
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: 'updating players failed!'
      });
    });

};
