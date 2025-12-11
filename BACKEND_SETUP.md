# Tasksmith Backend Setup Guide

This guide will help you set up the backend API server for Tasksmith.

## Architecture Overview

```
Frontend (React/Vite) → Backend API (Express) → PostgreSQL Database
     Port 5173              Port 3001           Port 5432
```

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or remote)
- Database credentials

## Setup Steps

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- `express` - Web server framework
- `pg` - PostgreSQL client
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### 2. Configure Database Connection

The `.env` file is already configured with your database:

```env
DATABASE_URL=postgresql://postgres:!11Thesame@185.221.22.73:5432/tasksmith
DATABASE_SSL=true
PORT=3001
```

If you need to change it, edit `backend/.env`

### 3. Create Database Schema (One-Time)

Connect to your PostgreSQL database and run this SQL:

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
# Then paste the SQL above
```

**Using pgAdmin or other GUI:**
- Connect to your database
- Open SQL query window
- Paste and execute the SQL above

### 4. Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
🚀 Backend server running on port 3001
📊 Database: 185.221.22.73:5432/tasksmith
🔗 API endpoint: http://localhost:3001/api
```

### 5. Start the Frontend

In a **new terminal**, from the project root:

```bash
npm run dev
```

Your app will open at `http://localhost:5173`

## Verify Everything Works

1. Open your browser to `http://localhost:5173`
2. The app should load without errors
3. Try creating a user account
4. Check your PostgreSQL database - you should see data in the `entities` table

## API Endpoints

The backend provides these endpoints:

- `GET /api/health` - Check server and database status
- `GET /api/entities/:type` - Get all entities of a type
- `POST /api/entities/:type` - Create new entity
- `PUT /api/entities/:type/:id` - Update entity
- `DELETE /api/entities/:type/:id` - Delete entity

## Troubleshooting

### "ECONNREFUSED" Error
- Make sure the backend server is running (`npm start` in `backend/` folder)
- Check that PORT 3001 is not in use by another process

### "Connection refused" to PostgreSQL
- Verify your database is running
- Check the `DATABASE_URL` in `backend/.env`
- Ensure your firewall allows connections to PostgreSQL

### "relation 'entities' does not exist"
- Run the database schema SQL (Step 3 above)

### CORS Errors
- Make sure both frontend and backend servers are running
- Backend should show "Backend server running" message

## Production Deployment

### Environment Variables
Set these on your hosting platform:
```env
DATABASE_URL=your_production_database_url
DATABASE_SSL=true
PORT=3001
```

### Deploy Backend
- Deploy `backend/` folder to your Node.js hosting service
- Ensure `npm install` and `npm start` run successfully

### Deploy Frontend
- Build: `npm run build` (from project root)
- Deploy the `dist/` folder to static hosting
- Update `src/database/api.ts` with your production backend URL

## Security Best Practices

✅ **DO:**
- Keep `.env` files private (they're in `.gitignore`)
- Use SSL for production databases (`DATABASE_SSL=true`)
- Use strong database passwords
- Keep dependencies updated

❌ **DON'T:**
- Commit `.env` files to Git
- Share database credentials publicly
- Expose backend server directly to internet without firewall

## Development Tips

**Auto-reload on changes:**
```bash
cd backend
npm run dev
```

**Check backend health:**
```bash
curl http://localhost:3001/api/health
```

**View server logs:**
Backend logs appear in the terminal where you ran `npm start`

## Need Help?

Check the `backend/README.md` for more details about the API structure and development workflow.
