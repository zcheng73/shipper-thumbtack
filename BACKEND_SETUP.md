# Backend API Setup Guide

Your Tasksmith app now uses a Node.js backend to safely connect to PostgreSQL. The frontend calls the backend API, which handles all database operations securely.

## Architecture

```
Frontend (React) → Backend API (Express) → PostgreSQL Database
```

This is the secure, industry-standard approach.

## Quick Start

### 1. Install Backend Dependencies

```bash
npm install express pg cors dotenv
```

### 2. Create `.env` file in project root

```env
DATABASE_URL=postgresql://postgres:!11Thesame@185.221.22.73:5432/tasksmith
DATABASE_SSL=true
PORT=3001
```

### 3. Create the Database Schema

Connect to your PostgreSQL database and run this SQL (one-time only):

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

**Using psql:**
```bash
psql -h 185.221.22.73 -U postgres -d tasksmith
```

Then paste the SQL above.

### 4. Start the Backend Server

```bash
node server.js
```

You should see:
```
Server running on port 3001
Database: postgresql://postgres:...@185.221.22.73:5432/tasksmith
```

### 5. In another terminal, start the frontend dev server

```bash
npm run dev
```

## Backend API Endpoints

The backend provides these REST endpoints:

- `GET /api/health` - Server health check
- `GET /api/db-test` - Test database connection
- `GET /api/entities/:entityType` - Get all entities of a type
- `POST /api/entities` - Create new entity
- `PUT /api/entities/:id` - Update entity
- `DELETE /api/entities/:id` - Delete entity

## Environment Variables

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:3001/api
```

**Backend (.env):**
```env
DATABASE_URL=postgresql://postgres:password@host:5432/database
DATABASE_SSL=true
PORT=3001
```

## Production Deployment

### Heroku Example

1. Create a Heroku app
2. Set environment variables:
   ```bash
   heroku config:set DATABASE_URL=postgresql://...
   heroku config:set DATABASE_SSL=true
   ```
3. Deploy:
   ```bash
   git push heroku main
   ```

### Railway/Render/DigitalOcean

Similar process - set the `DATABASE_URL` environment variable and deploy `server.js`.

## Troubleshooting

**"Cannot connect to database"**
- Verify DATABASE_URL is correct
- Check if PostgreSQL server is running
- Ensure firewall allows port 5432

**"CORS error"**
- Backend must be running on port 3001
- Frontend must have `VITE_API_URL` set correctly

**"Connection refused"**
- Ensure `node server.js` is running in a terminal
- Check that port 3001 is not in use: `lsof -i :3001`

## File Structure

```
tasksmith/
├── server.js                 # Backend Express server
├── .env                      # Backend configuration (DATABASE_URL, PORT)
├── src/
│   ├── database/
│   │   └── api.ts           # API client for frontend
│   ├── hooks/
│   │   └── useEntity.ts     # React hook using backend API
│   └── ...
└── package.json
```

## How It Works

1. **Frontend React component** calls `useEntity(config)`
2. **useEntity hook** calls backend API methods in `src/database/api.ts`
3. **Backend API** (server.js) receives the request
4. **Backend** queries PostgreSQL safely using parameterized queries
5. **Response** is returned as JSON to the frontend

This ensures:
- ✅ Credentials never exposed to browser
- ✅ Parameterized queries prevent SQL injection
- ✅ Connection pooling for efficiency
- ✅ Secure, production-ready architecture

## Next Steps

1. Run the database schema SQL on your PostgreSQL database
2. Start the backend: `node server.js`
3. Start the frontend: `npm run dev`
4. The app will now store all data in your PostgreSQL database!