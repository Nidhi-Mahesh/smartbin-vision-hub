
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, Clock, TrendingUp, Database, ArrowUp } from "lucide-react";
import Header from "@/components/Header";

const Dashboard = () => {
  const [binData, setBinData] = useState({
    bin_id: "SB01",
    fill_level_percent: 67,
    last_updated: new Date().toISOString(),
    latest_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
    prediction: {
      label: "Recyclable",
      confidence: 0.91
    }
  });

  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time data updates
        setBinData(prev => ({
          ...prev,
          fill_level_percent: Math.max(0, Math.min(100, prev.fill_level_percent + (Math.random() - 0.5) * 10)),
          last_updated: new Date().toISOString(),
          prediction: {
            label: ["Recyclable", "Organic", "Non-Recyclable"][Math.floor(Math.random() * 3)],
            confidence: 0.75 + Math.random() * 0.25
          }
        }));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getBinStatus = (level: number) => {
    if (level < 30) return { color: "bg-green-500", text: "Empty", textColor: "text-green-600" };
    if (level < 70) return { color: "bg-orange-500", text: "Half Full", textColor: "text-orange-600" };
    return { color: "bg-red-500", text: "Full", textColor: "text-red-600" };
  };

  const getPredictionColor = (label: string) => {
    switch (label) {
      case "Recyclable": return "bg-blue-100 text-blue-800";
      case "Organic": return "bg-green-100 text-green-800";
      case "Non-Recyclable": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const status = getBinStatus(binData.fill_level_percent);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Live Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time monitoring of SmartBin {binData.bin_id}</p>
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
            <Badge variant="outline" className="text-sm">
              <Clock size={12} className="mr-1" />
              Last updated: {new Date(binData.last_updated).toLocaleTimeString()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Bin Fill Level */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="text-blue-600" size={20} />
                <span>Bin Fill Level</span>
              </CardTitle>
              <CardDescription>Current capacity usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {Math.round(binData.fill_level_percent)}%
                  </div>
                  <Badge className={`${status.color} text-white`}>
                    {status.text}
                  </Badge>
                </div>
                <Progress value={binData.fill_level_percent} className="w-full h-3" />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Empty</span>
                  <span>Full</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Latest Image */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="text-green-600" size={20} />
                <span>Latest Capture</span>
              </CardTitle>
              <CardDescription>Most recent bin image</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={binData.latest_image} 
                    alt="Latest bin capture"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-sm text-gray-500 text-center">
                  Captured: {new Date(binData.last_updated).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ML Prediction */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="text-purple-600" size={20} />
                <span>AI Classification</span>
              </CardTitle>
              <CardDescription>Machine learning prediction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <Badge className={`text-lg py-2 px-4 ${getPredictionColor(binData.prediction.label)}`}>
                    {binData.prediction.label}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Confidence</span>
                    <span className="font-medium">{Math.round(binData.prediction.confidence * 100)}%</span>
                  </div>
                  <Progress value={binData.prediction.confidence * 100} className="w-full h-2" />
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Model: MobileNetV2 | TrashNet Dataset
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <CardTitle>System Status Overview</CardTitle>
            <CardDescription>Current operational parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">Online</div>
                <div className="text-sm text-gray-600">Connection Status</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">Normal</div>
                <div className="text-sm text-gray-600">Sensor Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">Active</div>
                <div className="text-sm text-gray-600">ML Processing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
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
