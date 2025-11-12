import express from 'express';
import * as basketballController from '../controllers/basketballController.js';

const router = express.Router()

router.get("/", basketballController.getScoresByDate);

// Get all games, optionally filter by sport
router.get('/games', basketballController.getScores);

// Trigger update for a specific sport
router.post('/update-scores', basketballController.updateScores);

// Clear all scores from database
router.delete('/clear-scores', basketballController.clearScores);

export default router;
