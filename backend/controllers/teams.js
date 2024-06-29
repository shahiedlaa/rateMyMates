const PlayersArray = require('../models/playersArray');

exports.addPlayersToTeam = (req, res, next) => {
  console.log('here');
  console.log(req.body)
  const players = new PlayersArray({
    teamId: req.body.teamId,
    players: req.body.players,
  });
  console.log(players);
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


