-- Labour Chowk Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(15) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('labour', 'employer')),
  name VARCHAR(255),
  language VARCHAR(2) DEFAULT 'hi',
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Labour profiles table
CREATE TABLE IF NOT EXISTS labour_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  skills TEXT[],
  daily_rate INTEGER,
  available BOOLEAN DEFAULT true,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  posted_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
  skill VARCHAR(50),
  rate INTEGER,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'in_progress', 'completed')),
  duration INTEGER,
  description TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_posted_by ON jobs(posted_by);
CREATE INDEX IF NOT EXISTS idx_jobs_skill ON jobs(skill);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);

-- Job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  labour_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  labour_name VARCHAR(255),
  labour_phone VARCHAR(15),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, labour_id)
);

-- Counter offers table
CREATE TABLE IF NOT EXISTS counter_offers (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  labour_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  labour_name VARCHAR(255),
  offered_rate INTEGER,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, labour_id)
);
