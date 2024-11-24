const mongoose = require("mongoose");

const playersArraySchema = mongoose.Schema({
  teamId: { type: String, required: true },
  players: { type: [String], required: true },
});

module.exports = mongoose.model("PlayersArray", playersArraySchema);
