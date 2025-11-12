import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  sport: { type: String, required: true }, // e.g., "baseball", "basketball"
  league: { type: String, required: true },
  homeTeam: { type: String, required: true },
  awayTeam: { type: String, required: true },
  homeScore: { type: Number, default: 0 },
  awayScore: { type: Number, default: 0 },
  status: { type: String, default: 'upcoming' },
  startTime: { type: Date },
  lastUpdated: { type: Date, default: Date.now },
});

const hockey = mongoose.model('hockeyScore', gameSchema);

export default hockey;
