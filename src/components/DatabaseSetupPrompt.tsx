import { AlertCircle, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface DatabaseSetupPromptProps {
  onOpenSettings: () => void;
}

export function DatabaseSetupPrompt({ onOpenSettings }: DatabaseSetupPromptProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Database Setup Required</CardTitle>
          <CardDescription className="text-base mt-2">
            Your PostgreSQL database needs to be initialized before using Tasksmith
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Database schema not found</p>
              <p>Please run the SQL schema to create the required tables.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Quick Setup Steps:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Connect to your PostgreSQL database at <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">185.221.22.73:5432</code></li>
              <li>Run the schema SQL found in <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">DATABASE_SCHEMA.sql</code></li>
              <li>Or use this command:
                <pre className="bg-gray-900 text-gray-100 p-3 rounded mt-2 overflow-x-auto text-xs">
psql -h 185.221.22.73 -U postgres -d homeservice -f DATABASE_SCHEMA.sql
                </pre>
              </li>
              <li>Refresh this page after the schema is created</li>
            </ol>
          </div>

          <div className="pt-4 space-y-3">
            <Button 
              onClick={onOpenSettings}
              className="w-full"
              size="lg"
            >
              <Database className="w-4 h-4 mr-2" />
              Open Database Settings
            </Button>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              Refresh Page
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            Need help? Check <code className="bg-gray-100 px-2 py-0.5 rounded">SETUP_INSTRUCTIONS.md</code> for detailed guidance
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
