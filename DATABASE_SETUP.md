# PostgreSQL Database Setup for Tasksmith

## Prerequisites
- PostgreSQL 12+ installed locally or a managed service (AWS RDS, DigitalOcean, Heroku, etc.)
- Database client (psql, pgAdmin, DBeaver, or similar)

## Step 1: Create Database

```bash
# Using psql command line
createdb tasksmith

# Or connect to PostgreSQL and run:
CREATE DATABASE tasksmith;
```

## Step 2: Run Schema Migration

Connect to your database and execute this SQL:

```sql
-- Create entities table
CREATE TABLE IF NOT EXISTS entities (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(255) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_entity_type ON entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_created_at ON entities(created_at);
CREATE INDEX IF NOT EXISTS idx_updated_at ON entities(updated_at);

-- Create GIN index for JSONB queries (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_data_gin ON entities USING GIN (data);
```

## Step 3: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# PostgreSQL Connection
VITE_DATABASE_URL=postgresql://username:password@localhost:5432/tasksmith

# For SSL connections (production)
VITE_DATABASE_SSL=true

# Examples for different providers:
# Local: postgresql://postgres:password@localhost:5432/tasksmith
# Heroku: postgresql://user:pass@host.compute.amazonaws.com:5432/dbname
# DigitalOcean: postgresql://doadmin:pass@db-postgresql-nyc3-12345.ondigitalocean.com:25060/tasksmith?sslmode=require
# AWS RDS: postgresql://admin:pass@tasksmith.abc123.us-east-1.rds.amazonaws.com:5432/tasksmith
```

## Step 4: Install Dependencies

```bash
npm install pg @types/pg
```

## Step 5: Start Development Server

```bash
npm run dev
```

## Verify Setup

1. Open the app in your browser
2. Try creating a user account
3. Check your PostgreSQL database:

```sql
-- View all entities
SELECT * FROM entities;

-- View users specifically
SELECT id, data->>'name' as name, data->>'email' as email, created_at 
FROM entities 
WHERE entity_type = 'User';

-- Count entities by type
SELECT entity_type, COUNT(*) 
FROM entities 
GROUP BY entity_type;
```

## Production Considerations

### Connection Pooling
The app uses `pg` connection pooling by default (configured in `src/database/client.ts`).

### SSL Configuration
For production databases, enable SSL:
```env
VITE_DATABASE_SSL=true
```

### Performance Tips
1. The JSONB GIN index helps with queries on data fields
2. Consider adding specific indexes for frequently queried fields:
```sql
CREATE INDEX idx_user_email ON entities ((data->>'email')) WHERE entity_type = 'User';
CREATE INDEX idx_service_provider ON entities ((data->>'providerId')) WHERE entity_type = 'Service';
```

### Backup Strategy
```bash
# Backup database
pg_dump tasksmith > tasksmith_backup.sql

# Restore database
psql tasksmith < tasksmith_backup.sql
```

## Troubleshooting

### Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check connection string format
- Ensure user has proper permissions
- For remote databases, check firewall rules

### Permission Errors
```sql
-- Grant permissions to user
GRANT ALL PRIVILEGES ON DATABASE tasksmith TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

### View Logs
```sql
-- Check PostgreSQL logs
-- Location varies by installation:
-- Ubuntu: /var/log/postgresql/
-- macOS (Homebrew): /usr/local/var/log/
-- Windows: C:\Program Files\PostgreSQL\<version>\data\log\
```

## Migration from Turso

All entity configurations remain the same. The migration only affects:
- Database client (`src/database/client.ts`)
- Repository layer (`src/repositories/flexibleEntityRepository.ts`)
- Environment variables

Your React components, hooks, and entity configs work identically!
