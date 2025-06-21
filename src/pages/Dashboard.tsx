
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, Recycle, Clock, AlertTriangle, ArrowUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [binData, setBinData] = useState({
    organic: {
      fill_level: 45,
      last_updated: new Date().toISOString()
    },
    inorganic: {
      fill_level: 78,
      last_updated: new Date().toISOString()
    }
  });

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setBinData(prev => ({
          organic: {
            fill_level: Math.max(0, Math.min(100, prev.organic.fill_level + (Math.random() - 0.5) * 8)),
            last_updated: new Date().toISOString()
          },
          inorganic: {
            fill_level: Math.max(0, Math.min(100, prev.inorganic.fill_level + (Math.random() - 0.5) * 8)),
            last_updated: new Date().toISOString()
          }
        }));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Alert logic
  useEffect(() => {
    if (alertsEnabled) {
      if (binData.organic.fill_level > 90) {
        toast({
          title: "Organic Bin Alert!",
          description: "Organic bin is over 90% full and needs emptying",
          variant: "destructive"
        });
      }
      if (binData.inorganic.fill_level > 90) {
        toast({
          title: "Inorganic Bin Alert!",
          description: "Inorganic bin is over 90% full and needs emptying",
          variant: "destructive"
        });
      }
    }
  }, [binData, alertsEnabled, toast]);

  const getBinStatus = (level: number) => {
    if (level < 60) return { color: "bg-green-500", text: "Safe", textColor: "text-green-600", bgColor: "bg-green-50" };
    if (level < 90) return { color: "bg-yellow-500", text: "Warning", textColor: "text-yellow-600", bgColor: "bg-yellow-50" };
    return { color: "bg-red-500", text: "Alert", textColor: "text-red-600", bgColor: "bg-red-50" };
  };

  const organicStatus = getBinStatus(binData.organic.fill_level);
  const inorganicStatus = getBinStatus(binData.inorganic.fill_level);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time monitoring of SmartBin fill levels</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? "default" : "outline"}
              className="flex items-center space-x-2"
            >
              <ArrowUp className={autoRefresh ? "animate-spin" : ""} size={16} />
              <span>{autoRefresh ? "Auto-Refresh ON" : "Auto-Refresh OFF"}</span>
            </Button>
            <Button
              onClick={() => setAlertsEnabled(!alertsEnabled)}
              variant={alertsEnabled ? "default" : "outline"}
              className="flex items-center space-x-2"
            >
              <AlertTriangle size={16} />
              <span>Alerts {alertsEnabled ? "ON" : "OFF"}</span>
            </Button>
          </div>
        </div>

        {/* Alert Banners */}
        {(binData.organic.fill_level > 90 || binData.inorganic.fill_level > 90) && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Critical Alert:</strong> One or more bins exceed 90% capacity and require immediate attention!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Organic Bin */}
          <Card className={`${organicStatus.bgColor} ${binData.organic.fill_level > 90 ? 'animate-pulse border-red-500' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Leaf className="text-green-600" size={24} />
                <span>Organic Bin 🍌</span>
              </CardTitle>
              <CardDescription>Biodegradable waste container</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {Math.round(binData.organic.fill_level)}%
                  </div>
                  <Badge className={`${organicStatus.color} text-white`}>
                    {organicStatus.text}
                  </Badge>
                </div>
                <Progress value={binData.organic.fill_level} className="w-full h-4" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Empty</span>
                  <span>Full</span>
                </div>
                <div className="text-center text-sm text-gray-600">
                  <Clock size={12} className="inline mr-1" />
                  Last updated: {new Date(binData.organic.last_updated).toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inorganic Bin */}
          <Card className={`${inorganicStatus.bgColor} ${binData.inorganic.fill_level > 90 ? 'animate-pulse border-red-500' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Recycle className="text-blue-600" size={24} />
                <span>Inorganic Bin 🧴</span>
              </CardTitle>
              <CardDescription>Non-biodegradable waste container</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {Math.round(binData.inorganic.fill_level)}%
                  </div>
                  <Badge className={`${inorganicStatus.color} text-white`}>
                    {inorganicStatus.text}
                  </Badge>
                </div>
                <Progress value={binData.inorganic.fill_level} className="w-full h-4" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Empty</span>
                  <span>Full</span>
                </div>
                <div className="text-center text-sm text-gray-600">
                  <Clock size={12} className="inline mr-1" />
                  Last updated: {new Date(binData.inorganic.last_updated).toLocaleTimeString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle>System Status Overview</CardTitle>
            <CardDescription>Current operational parameters and thresholds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">Online</div>
                <div className="text-sm text-gray-600">System Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">60%</div>
                <div className="text-sm text-gray-600">Warning Threshold</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 mb-1">90%</div>
                <div className="text-sm text-gray-600">Alert Threshold</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {autoRefresh ? "5s" : "Manual"}
                </div>
                <div className="text-sm text-gray-600">Update Interval</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
