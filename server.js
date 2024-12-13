//brukt chatgpt her //
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
app.use(express.json());
let leaderboard = [];
// Serve the HTML file when visiting the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// API for saving scores
app.post('/save-score', (req, res) => {
    const { playerName, score } = req.body;
    leaderboard.push({ playerName, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    res.send('Score saved!');
});
// API for retrieving highscore
app.get('/get-highscore', (req, res) => {
    res.json(leaderboard);
});
// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, '')));
// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});