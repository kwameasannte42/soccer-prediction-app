import axios from 'axios';

const proxyUrl = 'https://soccer-prediction-app-backend.onrender.com';  // Proxy server URL

// Fetch upcoming matches
export const getUpcomingMatches = async (date, leagueId) => {
  try {
    const response = await axios.get(`${proxyUrl}/matches`, {
      params: {
        date,
        league: leagueId,  // Pass the league ID
      },
    });
    console.log('API Response for matches:', response.data);  // Log the API response for debugging
    return response.data.response;  // Matches are in `response.data.response`
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};

// Fetch prediction based on historical data (head-to-head and recent matches)
export const getMatchPrediction = async (team1, team2) => {
  try {
    const response = await axios.get(`${proxyUrl}/prediction`, {
      params: {
        team1,
        team2,
      },
    });
    console.log('API Response for prediction:', response.data);  // Log the prediction API response
    const { headToHead, team1Recent, team2Recent } = response.data;

    // Simple prediction logic: Based on head-to-head wins and recent form
    let team1Wins = headToHead.filter(match => match.teams.home.id === team1 && match.goals.home > match.goals.away).length;
    let team2Wins = headToHead.filter(match => match.teams.away.id === team2 && match.goals.away > match.goals.home).length;

    if (team1Wins > team2Wins) {
      return { prediction: `Winner: ${headToHead[0].teams.home.name}` };
    } else {
      return { prediction: `Winner: ${headToHead[0].teams.away.name}` };
    }
  } catch (error) {
    console.error('Error fetching prediction:', error);
    throw error;
  }
};
