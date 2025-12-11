import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { toast } from 'sonner';

export function DatabaseSettings() {
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [testUrl, setTestUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved database URL from localStorage
    const saved = localStorage.getItem('VITE_DATABASE_URL');
    if (saved) {
      setDatabaseUrl(saved);
      setTestUrl(saved);
    }
  }, []);

  const handleSave = () => {
    if (!databaseUrl.trim()) {
      toast.error('Please enter a database URL');
      return;
    }

    if (!databaseUrl.startsWith('postgresql://')) {
      toast.error('URL must start with postgresql://');
      return;
    }

    setLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('VITE_DATABASE_URL', databaseUrl);
      setTestUrl(databaseUrl);
      setSaved(true);
      toast.success('Database URL saved successfully!');
      
      // Reset saved indicator after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      toast.error('Failed to save database URL');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!testUrl.trim()) {
      toast.error('Please enter a database URL');
      return;
    }

    setTesting(true);
    try {
      // Test connection by making a simple request
      const response = await fetch('/api/db/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: testUrl }),
      });

      if (response.ok) {
        toast.success('✅ Database connection successful!');
      } else {
        const error = await response.json();
        toast.error(`Connection failed: ${error.message}`);
      }
    } catch (error) {
      toast.error('Failed to test connection. Make sure your PostgreSQL server is running.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border border-gray-200">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              PostgreSQL Database Configuration
            </h3>
            <p className="text-sm text-gray-600">
              Configure your PostgreSQL connection string for the Tasksmith app.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Example PostgreSQL URLs:</p>
              <code className="block bg-white p-2 rounded border border-blue-200 mb-2 text-xs overflow-x-auto">
                postgresql://user:password@localhost:5432/tasksmith
              </code>
              <code className="block bg-white p-2 rounded border border-blue-200 text-xs overflow-x-auto">
                postgresql://user:password@db.example.com:5432/tasksmith
              </code>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Database URL
            </label>
            <Input
              type="password"
              placeholder="postgresql://user:password@host:5432/tasksmith"
              value={databaseUrl}
              onChange={(e) => setDatabaseUrl(e.target.value)}
              className="font-mono text-xs"
            />
            <p className="text-xs text-gray-500">
              Your credentials are encrypted and only stored locally in your browser.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Saved
                </>
              ) : (
                'Save URL'
              )}
            </Button>
            <Button
              onClick={handleTestConnection}
              disabled={testing}
              variant="outline"
              className="border-gray-300"
            >
              {testing ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </Button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <span className="font-medium">Note:</span> After setting your database URL, you may need to refresh the page for changes to take effect. Make sure your PostgreSQL server is running and accessible.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Steps</h3>
        <ol className="space-y-3 text-sm text-gray-700">
          <li className="flex gap-3">
            <span className="font-semibold text-gray-900 w-6">1.</span>
            <span>Create a PostgreSQL database (local or cloud)</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-gray-900 w-6">2.</span>
            <span>Run the schema creation SQL (see DATABASE_SETUP.md)</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-gray-900 w-6">3.</span>
            <span>Copy your connection URL above (postgresql://user:pass@host:port/db)</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-gray-900 w-6">4.</span>
            <span>Click "Save URL" to store it</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-gray-900 w-6">5.</span>
            <span>Click "Test Connection" to verify it works</span>
          </li>
        </ol>
      </Card>
    </div>
  );
}
