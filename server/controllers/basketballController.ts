import { type Request, type Response } from 'express';
import basketball from "../models/basketballModel.js";
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config({ path: './config.env' });

interface GameData {
    sport: string;
    league: string;
    homeTeam: string;
    awayTeam: string;
    homeScore?: number;
    awayScore?: number;
    status?: string;
    startTime?: Date;
}

export const getScores = async (req:Request, res:Response) => {
  try {
    const { sport, month, year } = req.query; // frontend can request ?sport=baseball&month=12&year=2023
    const query: any = sport ? { sport } : {};

    // Add date range filter if month and year are provided
    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);
      query.startTime = { $gte: startDate, $lte: endDate };
    }

    const games = await basketball.find(query).sort({ startTime: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

export const clearScores = async (req:Request, res:Response) => {
  try {
    const result = await basketball.deleteMany({});
    res.json({ message: `Deleted ${result.deletedCount} games` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear scores' });
  }
};

// Update NBA basketball scores
export const updateScores = async (req: Request<{}, {}, { date?: string }>, res: Response) => {
  try {
    const { date } = req.body;

    console.log('Updating NBA basketball scores for date:', date);

    const fullEndpoint = `${process.env.API_BASKETBALL}/games`;

    console.log('Using API endpoint:', fullEndpoint);

    // API-Sports uses headers for authentication
    // NBA seasons are referenced by the starting year (e.g., 2023 = 2023-2024 season)
    const season = "2023-2024"; // NBA season format

    // Build params object for NBA - league ID 12 is NBA
    const params: any = {
      league: 12, // NBA league ID
    };

    // Add date if provided (format: YYYY-MM-DD)
    // Note: Free plan only allows dates within 3-day window of current date
    if (date) {
      params.date = date;
    } else {
      // If no date provided, use season (format: YYYY-YYYY)
      params.season = season;
    }

    const response = await axios.get(fullEndpoint, {
      headers: {
        'x-rapidapi-key': process.env.SPORTS_API_KEY,
        'x-rapidapi-host': 'v1.basketball.api-sports.io'
      },
      params
    });

    console.log('API Response status:', response.status);
    console.log('API Response data:', JSON.stringify(response.data, null, 2));

    // API-Sports returns data in response.data.response array
    const gamesData = response.data.response;

    if (!gamesData || gamesData.length === 0) {
      console.log('No games found in API response');
      return res.status(200).json({ message: 'No games found to update' });
    }

    console.log(`Processing ${gamesData.length} games`);

    for (const game of gamesData) {
      console.log('Processing game:', JSON.stringify(game, null, 2));

      // Extract NBA basketball game data
      const homeTeam = game.teams?.home?.name;
      const awayTeam = game.teams?.away?.name;

      // Try different possible score fields
      const homeScore = game.scores?.home?.total
               || game.scores?.home?.score
               || game.scores?.home
               || game.home_score
               || 0;
      const awayScore = game.scores?.away?.total
               || game.scores?.away?.score
               || game.scores?.away
               || game.away_score
               || 0;

      const status = game.status?.long || game.status?.short || game.status || 'Unknown';
      const startTime = game.date || game.time;
      const leagueName = game.league?.name || 'NBA';

      console.log('Extracted data:', { homeTeam, awayTeam, homeScore, awayScore, status, startTime, leagueName });

      if (!homeTeam || !awayTeam) {
        console.log('Skipping game - missing team names');
        continue;
      }

      const result = await basketball.findOneAndUpdate(
        { sport: 'basketball', homeTeam, awayTeam },
        {
          sport: 'basketball',
          league: leagueName,
          homeScore,
          awayScore,
          status,
          startTime: new Date(startTime),
          lastUpdated: new Date(),
        },
        { upsert: true, new: true }
      );
      console.log('Saved game:', result);
    }

    res.status(200).json({ message: 'NBA basketball scores updated successfully' });
  } catch (err) {
    console.error('Error updating scores:', err);
    if (axios.isAxiosError(err)) {
      console.error('API Error Response:', err.response?.data);
      console.error('API Error Status:', err.response?.status);
    }
    res.status(500).json({ error: 'Failed to update scores' });
  }
};

// Example using Express + Mongoose
export const getScoresByDate = async (req: Request, res: Response) => {
  try {
    const { sport, date } = req.query as { sport?: string; date?: string };

    const filter: any = {};

    if (sport) filter.sport = sport;

    if (date) {
      // Parse the date string (YYYY-MM-DD) and create Date objects in local timezone
      const parts = date.split('-').map(Number);
      const year = parts[0];
      const month = parts[1];
      const day = parts[2];

      if (year && month && day) {
        const start = new Date(year, month - 1, day, 0, 0, 0, 0);
        const end = new Date(year, month - 1, day, 23, 59, 59, 999);
        filter.startTime = { $gte: start, $lte: end };
        console.log('Date filter:', { date, start, end });
      }
    }

    const scores = await basketball.find(filter).sort({ startTime: 1 });
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch scores" });
  }
};
