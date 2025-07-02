const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tempo: { type: Number, required: false },
  timestamp: { type: Date, default: Date.now },
});

SongSchema.index({ userId: 1, title: 1 });

module.exports = mongoose.model('Song', SongSchema);