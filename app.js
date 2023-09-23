const express = require('express');
const sqlite3 = require('sqlite3');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = 8000;

// Create database
const db = new sqlite3.Database('database.db');

// CORS options
const corsOptions = {
  origin: 'http://localhost:4200',
};

// Enable CORS
app.use(cors(corsOptions));

// Use morgan to log requests to the console
app.use(morgan('combined'));

//Create table for history and bookmarks
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY, videoUrl TEXT)'
  );
  db.run(
    'CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY, videoUrl TEXT)'
  );
});

// List all videos in history
app.get('/history', (req, res) => {
  db.all('SELECT * FROM history', (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send(rows);
    }
  });
});

// Add video to history
app.post('/history', (req, res) => {
  const videoUrl = req.query.videoUrl;

  // Check if videoUrl is provided
  if (!videoUrl) {
    res.status(400).send('videoUrl is required');

    // Check if videoUrl is already in history
  } else if (db.get('SELECT * FROM history WHERE videoUrl = ?', [videoUrl])) {
    res.status(400).send('videoUrl is already in history');
  } else {
    // Insert videoUrl into history
    db.run('INSERT INTO history (videoUrl) VALUES (?)', [videoUrl], (err) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        // If no error, send success message
        res.send('Video added to history');
      }
    });
  }
});

// List all videos in bookmarks
app.get('/bookmarks', (req, res) => {
  db.all('SELECT * FROM bookmarks', (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send(rows);
    }
  });
});

// Add video to bookmarks
app.post('/bookmarks', (req, res) => {
  const videoUrl = req.query.videoUrl;

  // Check if videoUrl is provided
  if (!videoUrl) {
    res.status(400).send('videoUrl is required');
    // Check if videoUrl is already in bookmarks
  } else if (db.get('SELECT * FROM bookmarks WHERE videoUrl = ?', [videoUrl])) {
    res.status(400).send('videoUrl is already in bookmarks');
  } else {
    // Insert videoUrl into bookmarks
    db.run('INSERT INTO bookmarks (videoUrl) VALUES (?)', [videoUrl], (err) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.send('Video added to bookmarks');
      }
    });
  }
});

// Delete video from bookmarks EXTRA
app.delete('/bookmarks', (req, res) => {
  const videoUrl = req.query.videoUrl;

  // Check if videoUrl is provided
  if (!videoUrl) {
    res.status(400).send('videoUrl is required');
    // Check if videoUrl is in bookmarks
  } else if (
    !db.get('SELECT * FROM bookmarks WHERE videoUrl = ?', [videoUrl])
  ) {
    res.status(400).send('videoUrl is not in bookmarks');
  } else {
    // Delete videoUrl from bookmarks
    db.run('DELETE FROM bookmarks WHERE videoUrl = ?', [videoUrl], (err) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.send('Video deleted from bookmarks');
      }
    });
  }
});

// Clear history
app.delete('/history', (req, res) => {
  db.run('DELETE FROM history', (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.send('History cleared');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
