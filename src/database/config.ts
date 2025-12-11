// PostgreSQL Database Configuration
// This file contains the database connection settings

export const getDatabaseConfig = () => {
  // Check if user has set custom database URL in localStorage
  const customUrl = typeof window !== 'undefined' 
    ? localStorage.getItem('dbUrl') 
    : null;

  // Default production database URL
  const defaultUrl = 'postgresql://postgres:!11Thesame@185.221.22.73:5432/tasksmith';

  return {
    url: customUrl || defaultUrl,
    ssl: false, // Set to true if your PostgreSQL server requires SSL
  };
};

export const DATABASE_URL = getDatabaseConfig().url;
export const DATABASE_SSL = getDatabaseConfig().ssl;

// Add connection validation
export const validateDatabaseUrl = (url: string): boolean => {
  try {
    return url.startsWith('postgresql://') || url.startsWith('postgres://');
  } catch {
    return false;
  }
};
