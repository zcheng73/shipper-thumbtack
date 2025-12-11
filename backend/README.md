# Tasksmith Backend API

Express.js backend server for Tasksmith application with PostgreSQL database.

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and update with your database credentials:
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://postgres:password@host:5432/tasksmith
DATABASE_SSL=true
PORT=3001
```

### 3. Create Database Schema
Connect to your PostgreSQL database and run:
```sql
CREATE TABLE IF NOT EXISTS entities (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(255) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_entity_type ON entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_data_gin ON entities USING GIN (data);
```

### 4. Start Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

Server will run on `http://localhost:3001`

## API Endpoints

### Health Check
```
GET /api/health
```

### Get All Entities
```
GET /api/entities/:entityType?orderBy=created_at DESC
```

### Create Entity
```
POST /api/entities/:entityType
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Update Entity
```
PUT /api/entities/:entityType/:id
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

### Delete Entity
```
DELETE /api/entities/:entityType/:id
```

## Project Structure
```
backend/
├── server.js          # Express server and API routes
├── package.json       # Dependencies and scripts
├── .env              # Environment variables (not in git)
├── .env.example      # Example environment config
└── README.md         # This file
```

## Security Notes
- Database credentials are stored in `.env` (never committed to git)
- CORS is enabled for frontend access
- SSL is configurable for production databases
- All database queries use parameterized statements to prevent SQL injection

## Development
The server uses Node.js native watch mode for auto-reload during development:
```bash
npm run dev
```

Changes to `server.js` will automatically restart the server.
