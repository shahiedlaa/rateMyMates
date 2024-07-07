const Gameweek = require('../models/gameweek');

exports.addGameweek = (req, res, next) => {
  const gameweek = new Gameweek({
    teamId: req.body.teamId,
    players: req.body.players,
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
