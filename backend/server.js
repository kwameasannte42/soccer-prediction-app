const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const apiFootballUrl = 'https://api-football-v1.p.rapidapi.com/v3';
const apiKey = 'e5c0f7c772mshe7e9e072538b99ep110284jsn239f96e52fdc';  // Replace with your valid RapidAPI key
const apiHost = 'api-football-v1.p.rapidapi.com';

app.use(cors());

// Fetch upcoming matches
app.get('/matches', async (req, res) => {
  try {
    const { date, league } = req.query;
    console.log(`Fetching matches for date: ${date}, league: ${league}`);  // Log the request details

    const options = {
      method: 'GET',
      url: `${apiFootballUrl}/fixtures`,
      params: {
        date,              // The date in `YYYY-MM-DD` format
        league,            // The league ID (e.g., 39 for EPL)
        season: 2024       // The season (2024 for the next season)
      },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
      },
    };

    const response = await axios.request(options);
    console.log('API Response from API-Football:', response.data);  // Log the API response for debugging
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching matches from API-Football:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching matches');
  }
});

// Fetch head-to-head and recent matches for prediction
app.get('/prediction', async (req, res) => {
  const { team1, team2 } = req.query;  // IDs of the two teams

  try {
    console.log(`Fetching prediction for team1: ${team1} and team2: ${team2}`);  // Log the request details

    // Fetch head-to-head matches
    const h2hResponse = await axios.get(`${apiFootballUrl}/fixtures/headtohead`, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
      },
      params: {
        h2h: `${team1}-${team2}`
      }
    });

    const historicalMatches = h2hResponse.data.response;

    // Fetch recent matches of team1 and team2
    const recentTeam1 = await axios.get(`${apiFootballUrl}/fixtures`, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
      },
      params: {
        team: team1,
        last: 5,  // Fetch the last 5 matches
      }
    });

    const recentTeam2 = await axios.get(`${apiFootballUrl}/fixtures`, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost,
      },
      params: {
        team: team2,
        last: 5,  // Fetch the last 5 matches
      }
    });

    res.json({
      headToHead: historicalMatches,
      team1Recent: recentTeam1.data.response,
      team2Recent: recentTeam2.data.response
    });
  } catch (error) {
    console.error('Error fetching historical data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching historical data');
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
