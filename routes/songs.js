const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// Middleware to get userId from headers
router.use((req, res, next) => {
  req.userId = req.header('x-user-id');
  if (!req.userId) return res.status(400).json({ error: 'Missing x-user-id header' });
  next();
});

// Create song
router.post('/', async (req, res) => {
  try {
    const { title, content, tempo } = req.body;
    const existing = await Song.findOne({ title, userId: req.userId });
    if (existing) return res.status(409).json({ error: 'Song with this title already exists' });

    const newSong = new Song({ title, content, tempo, userId: req.userId });
    const saved = await newSong.save();
    res.json({ id: saved._id, message: 'Song saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Overwrite song
router.put('/:id', async (req, res) => {
  try {
    const { content, tempo } = req.body;
    const song = await Song.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { content, tempo },
      { new: true }
    );
    if (!song) return res.status(404).json({ error: 'Song not found' });
    res.json({ message: 'Song updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find({ userId: req.userId }).select('title timestamp tempo');
res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get specific song
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findOne({ _id: req.params.id, userId: req.userId });
    if (!song) return res.status(404).json({ error: 'Song not found' });
    res.json(song);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete song
router.delete('/:id', async (req, res) => {
  try {
    await Song.deleteOne({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Song deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;