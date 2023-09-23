const express = require('express');
const sqlite3 = require('sqlite3');

const morgan = require('morgan'); // HTTP request logger
const cors = require('cors'); // CORS
const fs = require('fs'); // File system
const path = require('path'); // Path

const app = express();
const port = 8000;

app.use(express.json()); // Parse JSON bodies

// Create database
const db = new sqlite3.Database('database.db');

// CORS options
const corsOptions = {
  origin: 'http://localhost:4200',
};

// Enable CORS
app.use(cors(corsOptions));

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {
  flags: 'a',
});

// Use morgan to log requests to the console
app.use(morgan('combined', { stream: accessLogStream }));

//Create table for history and bookmarks
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY, videoUrl TEXT, lastAccess DATETIME DEFAULT CURRENT_TIMESTAMP)'
  );
  db.run(
    'CREATE TABLE IF NOT EXISTS bookmarks (id INTEGER PRIMARY KEY, videoUrl TEXT, addDate DATETIME DEFAULT CURRENT_TIMESTAMP)'
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
  const videoUrl = req.body.videoUrl;

  if (!videoUrl) {
    return res.status(400).send('Video URL is required.');
  }

  db.get(
    'SELECT COUNT(*) as count FROM history WHERE videoUrl = ?',
    [videoUrl],
    (err, row) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      const count = row.count;

      if (count > 0) {
        db.run(
          'UPDATE history SET lastAccess = CURRENT_TIMESTAMP WHERE videoUrl = ?',
          [videoUrl]
        );
        // res.status(200).send('This video URL is already in the history.');
      } else {
        db.run(
          'INSERT INTO history (videoUrl) VALUES (?)',
          [videoUrl],
          (err) => {
            if (err) {
              res.status(500).send(err.message);
            } else {
              res.send('Video added to history successfully.');
            }
          }
        );
      }
    }
  );
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
  const videoUrl = req.body.videoUrl;

  if (!videoUrl) {
    return res.status(400).send('Video URL is required.');
  }

  db.get(
    'SELECT COUNT(*) as count FROM bookmarks WHERE videoUrl = ?',
    [videoUrl],
    (err, row) => {
      if (err) {
        return res.status(500).send(err.message);
      }

      const count = row.count;

      if (count > 0) {
        res.status(200).send('This video URL is already in the bookmarks.');
      } else {
        db.run(
          'INSERT INTO bookmarks (videoUrl) VALUES (?)',
          [videoUrl],
          (err) => {
            if (err) {
              res.status(500).send(err.message);
            } else {
              res.send('Video added to bookmarks successfully.');
            }
          }
        );
      }
    }
  );
});

// Delete video from bookmarks EXTRA
app.delete('/bookmarks', (req, res) => {
  const videoUrl = req.query.videoUrl;

  // Check if videoUrl is provided
  if (!videoUrl) {
    res.status(400).send('videoUrl is required');
    // Check if videoUrl is in bookmarks
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
