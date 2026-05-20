CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS songs (
  song_id BIGINT PRIMARY KEY,
  song_name VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  album VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS reviews (
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  song_id BIGINT NOT NULL REFERENCES songs(song_id) ON DELETE CASCADE,
  review_title VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 10),
  review_date DATE NOT NULL,
  review_body TEXT NOT NULL,
  PRIMARY KEY (user_id, song_id)
);

CREATE INDEX IF NOT EXISTS idx_reviews_song_id ON reviews(song_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
