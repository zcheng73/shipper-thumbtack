# PostgreSQL Database Setup Instructions

Your Tasksmith app is now configured to connect to your PostgreSQL database!

## Database Connection Details

- **Host:** 185.221.22.73:5432
- **Database:** homeservice
- **Connection configured:** ✅ Ready to use

## Next Step: Run the Schema

You need to create the database tables. Connect to your PostgreSQL database and run the SQL script:

### Option 1: Using psql command line

```bash
psql -h 185.221.22.73 -U postgres -d homeservice -f DATABASE_SCHEMA.sql
```

### Option 2: Using pgAdmin or any PostgreSQL client

1. Connect to your database (185.221.22.73:5432)
2. Open the `DATABASE_SCHEMA.sql` file
3. Execute the entire script
4. You should see "Database schema created successfully!"

### Option 3: Copy and paste SQL manually

Open your PostgreSQL client and run this SQL:

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
CREATE INDEX IF NOT EXISTS idx_created_at ON entities(created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_entities_updated_at ON entities;
CREATE TRIGGER update_entities_updated_at
  BEFORE UPDATE ON entities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## Verify Setup

After running the schema, your app will automatically:
- ✅ Connect to your PostgreSQL database
- ✅ Store all user data (customers, providers, bookings, reviews)
- ✅ Persist data permanently across sessions

## Testing the Connection

1. Open your Tasksmith app
2. Sign up for a new account
3. Create a booking or leave a review
4. Check your PostgreSQL database - you should see data in the `entities` table!

## Troubleshooting

If you encounter connection issues:
- Verify the database server is accessible from your network
- Check firewall rules allow connections on port 5432
- Confirm the postgres user has the correct password
- Make sure SSL is disabled (or enable it in src/database/config.ts)

## Security Note

Your database credentials are now hardcoded in the app. For production:
- Consider using environment variables
- Implement proper authentication
- Use SSL connections
- Restrict database access by IP address

Your database is ready to go! 🚀
