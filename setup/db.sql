-- Create UserAccounts table
CREATE TABLE user_accounts (
  user_id TEXT PRIMARY KEY,
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  user_name VARCHAR UNIQUE NOT NULL,
  avatar VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'active'
);

-- Create UserAuth table
CREATE TABLE user_auth (
  id INTEGER,
  user_id TEXT REFERENCES user_accounts(user_id),
  auth_type VARCHAR NOT NULL,
  auth_provider VARCHAR,
  auth_key VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'active',
  PRIMARY KEY (id,user_id, auth_key)
);

-- Create Sessions table
CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  sid VARCHAR UNIQUE NOT NULL,
  user_id TEXT REFERENCES user_accounts(user_id),
  token TEXT NOT NULL,
  app_id TEXT,
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_sso BOOLEAN DEFAULT FALSE
);

-- Create LoginHistory table
CREATE TABLE login_histories (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES user_accounts(user_id),
  app_id TEXT,
  rid VARCHAR,
  sid VARCHAR,
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip INET NOT NULL,
  metadata JSONB DEFAULT '{}'
);

CREATE TABLE artists (
    artist_id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    user_id TEXT DEFAULT NULL,
    streams VARCHAR(255) UNIQUE NOT NULL,
    avatar VARCHAR(255),
    status VARCHAR(255) DEFAULT 'active',
    create_by VARCHAR(255) DEFAULT NULL
);