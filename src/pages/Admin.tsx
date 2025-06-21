
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Database, RefreshCw, LogOut, Brain, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [systemLogs, setSystemLogs] = useState([
    { id: 1, timestamp: "2025-06-21T15:30:00Z", level: "INFO", message: "Bin fill level updated: 67%" },
    { id: 2, timestamp: "2025-06-21T15:25:00Z", level: "SUCCESS", message: "Image classified as Recyclable (91% confidence)" },
    { id: 3, timestamp: "2025-06-21T15:20:00Z", level: "INFO", message: "New image captured and processed" },
    { id: 4, timestamp: "2025-06-21T15:15:00Z", level: "WARNING", message: "Bin approaching 70% capacity" },
    { id: 5, timestamp: "2025-06-21T15:10:00Z", level: "SUCCESS", message: "System health check completed" }
  ]);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication
    const isAdmin = localStorage.getItem("smartbin_admin");
    if (isAdmin === "true") {
      setIsAuthenticated(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("smartbin_admin");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  const resetBinLevel = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Bin Level Reset",
        description: "Bin fill level has been reset to 0%",
      });
      setIsLoading(false);
      
      // Add new log entry
      const newLog = {
        id: systemLogs.length + 1,
        timestamp: new Date().toISOString(),
        level: "INFO",
        message: "Bin fill level manually reset by admin"
      };
      setSystemLogs(prev => [newLog, ...prev]);
    }, 1000);
  };

  const triggerRetraining = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Model Retraining Initiated",
        description: "ML model retraining has been queued",
      });
      setIsLoading(false);
      
      // Add new log entry
      const newLog = {
        id: systemLogs.length + 1,
        timestamp: new Date().toISOString(),
        level: "INFO",
        message: "ML model retraining initiated by admin"
      };
      setSystemLogs(prev => [newLog, ...prev]);
    }, 1500);
  };

  const saveNotes = () => {
    toast({
      title: "Notes Saved",
      description: "Admin notes have been saved successfully",
    });
    
    // Add new log entry
    const newLog = {
      id: systemLogs.length + 1,
      timestamp: new Date().toISOString(),
      level: "INFO",
      message: "Admin notes updated"
    };
    setSystemLogs(prev => [newLog, ...prev]);
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "SUCCESS": return "bg-green-100 text-green-800";
      case "WARNING": return "bg-orange-100 text-orange-800";
      case "ERROR": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">System management and configuration</p>
          </div>
          
          <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="text-blue-600" size={20} />
                <span>Bin Management</span>
              </CardTitle>
              <CardDescription>Reset and manage bin parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={resetBinLevel} 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? "Resetting..." : "Reset Bin Fill Level"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="text-purple-600" size={20} />
                <span>ML Model</span>
              </CardTitle>
              <CardDescription>Manage machine learning model</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={triggerRetraining} 
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Initiating..." : "Trigger Model Retraining"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="text-green-600" size={20} />
                <span>System Status</span>
              </CardTitle>
              <CardDescription>Current system health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sensors</span>
                  <Badge className="bg-green-100 text-green-800">Online</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">ML Model</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Logs */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="text-orange-600" size={20} />
                <span>System Logs</span>
              </CardTitle>
              <CardDescription>Recent system events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {systemLogs.map((log) => (
                  <div key={log.id} className="border-l-4 border-gray-200 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <Badge className={getLevelBadge(log.level)}>
                        {log.level}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{log.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="text-gray-600" size={20} />
                <span>Admin Notes</span>
              </CardTitle>
              <CardDescription>Add notes and comments for system maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={10}
                  className="w-full"
                />
                <Button onClick={saveNotes} className="w-full">
                  Save Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Current system configuration and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Hardware</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Ultrasonic Sensor: HC-SR04</li>
                  <li>• Camera: Pi Camera V2</li>
                  <li>• MCU: Raspberry Pi 4</li>
                  <li>• Storage: 32GB SD Card</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Software</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• OS: Raspbian Lite</li>
                  <li>• Python: 3.9.2</li>
                  <li>• TensorFlow: 2.8.0</li>
                  <li>• OpenCV: 4.5.1</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">ML Model</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Architecture: MobileNetV2</li>
                  <li>• Dataset: TrashNet + TACO</li>
                  <li>• Accuracy: 89.2%</li>
                  <li>• Last Trained: 2025-06-15</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Connectivity</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• WiFi: Connected</li>
                  <li>• Firebase: Active</li>
                  <li>• MQTT: Connected</li>
                  <li>• API: Responding</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
