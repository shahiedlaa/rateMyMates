const mongoose = require('mongoose');

const gameweekSchema = mongoose.Schema({
  teamId: { type: String, required: true },
  weeksArray: {
    type: [{
      week: Number,
      players: [{ player: String, rating: Number }]
    }]
  }
});



module.exports = mongoose.model('Gameweek', gameweekSchema);
