import express from 'express';
import * as hockeyController from '../controllers/hockeyController.js';

const router = express.Router()

router.get("/", hockeyController.getScoresByDate);

// Get all games, optionally filter by sport
router.get('/games', hockeyController.getScores);

// Trigger update for a specific sport
router.post('/update-scores', hockeyController.updateScores);

// Clear all scores from database
router.delete('/clear-scores', hockeyController.clearScores);

export default router;
