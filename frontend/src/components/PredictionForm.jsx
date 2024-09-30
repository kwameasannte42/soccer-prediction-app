import React, { useState } from 'react';
import { getUpcomingMatches, getMatchPrediction } from '../services/apiService';
import '../styles/styles.css';  // Import the modern styles

const leagues = [
  { name: 'EPL', id: 39 },        // Premier League
  { name: 'La Liga', id: 140 },   // La Liga
  { name: 'Serie A', id: 135 },   // Serie A
  { name: 'Bundesliga', id: 78 }, // Bundesliga
  { name: 'Ligue 1', id: 61 },    // Ligue 1
  { name: 'UEFA Champions League', id: 2 },    // Champions League
  { name: 'UEFA Europa League', id: 3 },       // Europa League
  { name: 'Carabao Cup', id: 48 },             // Carabao Cup
  { name: 'FA Cup', id: 45 },                  // FA Cup
  { name: 'UEFA Conference League', id: 848 }, // Conference League
  { name: 'Portugal Primeira Liga', id: 94 },  // Portugal Primeira Liga
  { name: 'MLS', id: 253 },                    // Major League Soccer (MLS)
  { name: 'Coppa Italia', id: 137 },           // Coppa Italia
  { name: 'English League 2', id: 41 },        // English League 2
  { name: 'English Championship', id: 40 },    // Championship
];

const PredictionForm = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState({});

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleLeagueChange = (e) => {
    setSelectedLeague(e.target.value);
  };

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const result = await getUpcomingMatches(selectedDate, selectedLeague);
      setMatches(result);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMatches();
  };

  const handlePredict = async (match) => {
    try {
      const prediction = await getMatchPrediction(match.teams.home.id, match.teams.away.id);
      setPredictions((prev) => ({
        ...prev,
        [match.fixture.id]: prediction,
      }));
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  return (
    <div className="app-container">
      <h1>Soccer Prediction App</h1>
      <form onSubmit={handleSubmit} className="prediction-form">
        <div>
          <label>Date:</label>
          <input type="date" value={selectedDate} onChange={handleDateChange} required />
        </div>

        <div>
          <label>Leagues:</label>
          <select value={selectedLeague} onChange={handleLeagueChange} required>
            <option value="">Select a league</option>
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>{league.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Matches'}
        </button>
      </form>

      {matches.length === 0 && !loading && (
        <p>No matches found for the selected date and league.</p>
      )}

      {matches.length > 0 && (
        <div>
          <h2>Upcoming Matches</h2>
          <ul>
            {matches.map(match => (
              <li key={match.fixture.id} className="match-item">
                <div>
                  <p>{match.teams.home.name} vs {match.teams.away.name}</p>
                  <p>{new Date(match.fixture.date).toLocaleString()}</p>
                </div>
                <div>
                  <button onClick={() => handlePredict(match)}>
                    {predictions[match.fixture.id] ? 'Predicted' : 'Predict Winner'}
                  </button>

                  {predictions[match.fixture.id] && (
                    <div className="prediction-result">
                      <p>
                        Prediction: 
                        <span className={predictions[match.fixture.id].prediction === match.teams.home.name ? 'winner-home' : 'winner-away'}>
                          {predictions[match.fixture.id].prediction}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
