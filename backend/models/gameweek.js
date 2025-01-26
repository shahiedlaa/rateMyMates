const mongoose = require("mongoose");

const gameweekSchema = mongoose.Schema({
  teamId: { type: String, required: true },
  weeksArray: {
    type: [
      {
        week: Number,
        teamScore: Number,
        opponentScore: Number,
        opponent: String,
        date: Date,
        // goalScorers: [{ player: String, goals: Number }],
        // goalAssists: [{ player: String, assists: Number }],
        players: [
          { player: String, rating: [{ ratedBy: String, rating: Number }] },
        ],
      },
    ],
  },
});

module.exports = mongoose.model("Gameweek", gameweekSchema);
