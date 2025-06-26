import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, Recycle, Clock, AlertTriangle, ArrowUp, Battery, Wrench, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

const Dashboard = () => {
  const [binData, setBinData] = useState({
    organic: {
      fill_level: 45,
      last_updated: new Date().toISOString(),
      battery_level: 85,
      last_maintenance: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      fill_rate: 2.3 // percentage per hour
    },
    inorganic: {
      fill_level: 78,
      last_updated: new Date().toISOString(),
      battery_level: 92,
      last_maintenance: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      fill_rate: 1.8 // percentage per hour
    }
  });

  const [autoRefresh, setAutoRefresh] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const { toast } = useToast();

  // Calculate estimated time to full
  const getTimeToFull = (currentLevel: number, fillRate: number) => {
    if (fillRate <= 0) return "N/A";
    const remainingCapacity = 100 - currentLevel;
    const hoursToFull = remainingCapacity / fillRate;
    
    if (hoursToFull < 1) return `${Math.round(hoursToFull * 60)} mins`;
    if (hoursToFull < 24) return `${Math.round(hoursToFull)} hrs`;
    return `${Math.round(hoursToFull / 24)} days`;
  };

  // Calculate days since last maintenance
  const getDaysSinceLastMaintenance = (lastMaintenance: string) => {
    const days = Math.floor((Date.now() - new Date(lastMaintenance).getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Get battery status
  const getBatteryStatus = (level: number) => {
    if (level > 70) return { color: "text-green-600", bgColor: "bg-green-100", text: "Good" };
    if (level > 30) return { color: "text-yellow-600", bgColor: "bg-yellow-100", text: "Medium" };
    return { color: "text-red-600", bgColor: "bg-red-100", text: "Low" };
  };

  useEffect(() => {
    const organicRef = ref(db, "/dustbin/organic_fill_percent");
    const unsubscribe = onValue(organicRef, (snapshot) => {
      setBinData(prev => ({
        ...prev,
        organic: {
          ...prev.organic,
          fill_level: snapshot.val() ?? prev.organic.fill_level,
          last_updated: new Date().toISOString(),
        }
      }));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setBinData(prev => ({
          organic: {
            ...prev.organic,
            last_updated: new Date().toISOString(),
            battery_level: Math.max(0, Math.min(100, prev.organic.battery_level + (Math.random() - 0.5) * 2)),
            fill_rate: Math.max(0.1, prev.organic.fill_rate + (Math.random() - 0.5) * 0.2)
          },
          inorganic: {
            ...prev.inorganic,
            fill_level: Math.max(0, Math.min(100, prev.inorganic.fill_level + (Math.random() - 0.3) * 2)),
            last_updated: new Date().toISOString(),
            battery_level: Math.max(0, Math.min(100, prev.inorganic.battery_level + (Math.random() - 0.5) * 2)),
            fill_rate: Math.max(0.1, prev.inorganic.fill_rate + (Math.random() - 0.5) * 0.2)
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
      if (binData.organic.battery_level < 20) {
        toast({
          title: "Low Battery Alert!",
          description: "Organic bin battery is below 20%",
          variant: "destructive"
        });
      }
      if (binData.inorganic.battery_level < 20) {
        toast({
          title: "Low Battery Alert!",
          description: "Inorganic bin battery is below 20%",
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
  const organicBattery = getBatteryStatus(binData.organic.battery_level);
  const inorganicBattery = getBatteryStatus(binData.inorganic.battery_level);

  const handleManualRefresh = () => {
    setBinData(prev => ({
      organic: {
        ...prev.organic,
        last_updated: new Date().toISOString()
      },
      inorganic: {
        ...prev.inorganic,
        last_updated: new Date().toISOString()
      }
    }));
    toast({
      title: "Data Refreshed",
      description: "Bin data has been updated manually"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time monitoring of SmartBin fill levels</p>
            <div className="text-sm text-gray-500 mt-1">
              <Clock size={12} className="inline mr-1" />
              Last update: {new Date().toLocaleString()}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleManualRefresh}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowUp size={16} />
              <span>Manual Refresh</span>
            </Button>
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
        {(binData.organic.fill_level > 90 || binData.inorganic.fill_level > 90 || 
          binData.organic.battery_level < 20 || binData.inorganic.battery_level < 20) && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Critical Alert:</strong> One or more bins require immediate attention!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Organic Bin */}
          <Card className={`${organicStatus.bgColor} ${binData.organic.fill_level > 90 ? 'animate-pulse border-red-500' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Leaf className="text-green-600" size={24} />
                  <span>Organic Bin 🍌</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery className={organicBattery.color} size={16} />
                  <span className={`text-sm ${organicBattery.color}`}>
                    {binData.organic.battery_level}%
                  </span>
                </div>
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
                
                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="font-medium text-gray-700">Time to Full</div>
                    <div className="text-blue-600 font-semibold">
                      {getTimeToFull(binData.organic.fill_level, binData.organic.fill_rate)}
                    </div>
                  </div>
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="font-medium text-gray-700">Fill Rate</div>
                    <div className="text-purple-600 font-semibold">
                      {binData.organic.fill_rate.toFixed(1)}%/hr
                    </div>
                  </div>
                </div>
                
                <div className="text-center space-y-1">
                  <div className="text-sm text-gray-600">
                    <Clock size={12} className="inline mr-1" />
                    Last updated: {new Date(binData.organic.last_updated).toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    <Wrench size={12} className="inline mr-1" />
                    Last emptied: {getDaysSinceLastMaintenance(binData.organic.last_maintenance)} days ago
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inorganic Bin */}
          <Card className={`${inorganicStatus.bgColor} ${binData.inorganic.fill_level > 90 ? 'animate-pulse border-red-500' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Recycle className="text-blue-600" size={24} />
                  <span>Inorganic Bin 🧴</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Battery className={inorganicBattery.color} size={16} />
                  <span className={`text-sm ${inorganicBattery.color}`}>
                    {binData.inorganic.battery_level}%
                  </span>
                </div>
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
                
                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="font-medium text-gray-700">Time to Full</div>
                    <div className="text-blue-600 font-semibold">
                      {getTimeToFull(binData.inorganic.fill_level, binData.inorganic.fill_rate)}
                    </div>
                  </div>
                  <div className="bg-white/50 p-3 rounded-lg">
                    <div className="font-medium text-gray-700">Fill Rate</div>
                    <div className="text-purple-600 font-semibold">
                      {binData.inorganic.fill_rate.toFixed(1)}%/hr
                    </div>
                  </div>
                </div>
                
                <div className="text-center space-y-1">
                  <div className="text-sm text-gray-600">
                    <Clock size={12} className="inline mr-1" />
                    Last updated: {new Date(binData.inorganic.last_updated).toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    <Wrench size={12} className="inline mr-1" />
                    Last emptied: {getDaysSinceLastMaintenance(binData.inorganic.last_maintenance)} days ago
                  </div>
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1 flex items-center justify-center">
                  <Zap className="mr-1" size={20} />
                  Online
                </div>
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
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {Math.round((binData.organic.battery_level + binData.inorganic.battery_level) / 2)}%
                </div>
                <div className="text-sm text-gray-600">Avg Battery</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
