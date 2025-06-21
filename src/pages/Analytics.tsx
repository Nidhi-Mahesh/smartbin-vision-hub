
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, PieChart, BarChart, Download } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from "recharts";
import Header from "@/components/Header";

const Analytics = () => {
  // Sample analytics data
  const dailyData = [
    { day: "Mon", Recyclable: 12, Organic: 8, "Non-Recyclable": 15 },
    { day: "Tue", Recyclable: 18, Organic: 12, "Non-Recyclable": 10 },
    { day: "Wed", Recyclable: 15, Organic: 20, "Non-Recyclable": 8 },
    { day: "Thu", Recyclable: 22, Organic: 15, "Non-Recyclable": 12 },
    { day: "Fri", Recyclable: 28, Organic: 18, "Non-Recyclable": 14 },
    { day: "Sat", Recyclable: 35, Organic: 25, "Non-Recyclable": 18 },
    { day: "Sun", Recyclable: 30, Organic: 22, "Non-Recyclable": 16 }
  ];

  const pieData = [
    { name: "Recyclable", value: 160, color: "#3B82F6" },
    { name: "Organic", value: 120, color: "#10B981" },
    { name: "Non-Recyclable", value: 93, color: "#6B7280" }
  ];

  const binLevelData = [
    { time: "00:00", level: 15 },
    { time: "04:00", level: 18 },
    { time: "08:00", level: 35 },
    { time: "12:00", level: 52 },
    { time: "16:00", level: 68 },
    { time: "20:00", level: 45 },
    { time: "23:59", level: 30 }
  ];

  const totalWaste = pieData.reduce((sum, item) => sum + item.value, 0);

  const exportReport = () => {
    // In a real app, this would generate a comprehensive report
    console.log("Exporting analytics report...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive waste management insights and trends</p>
          </div>
          
          <Button onClick={exportReport} className="flex items-center space-x-2">
            <Download size={16} />
            <span>Export Report</span>
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900">{totalWaste}</p>
                </div>
                <TrendingUp className="text-blue-600" size={24} />
              </div>
              <p className="text-sm text-green-600 mt-2">+12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recyclable</p>
                  <p className="text-3xl font-bold text-blue-600">160</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{Math.round((160/totalWaste) * 100)}% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Organic</p>
                  <p className="text-3xl font-bold text-green-600">120</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{Math.round((120/totalWaste) * 100)}% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Non-Recyclable</p>
                  <p className="text-3xl font-bold text-gray-600">93</p>
                </div>
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">{Math.round((93/totalWaste) * 100)}% of total</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Waste Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart className="text-blue-600" size={20} />
                <span>Daily Waste Classification</span>
              </CardTitle>
              <CardDescription>Breakdown by category over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Recyclable" fill="#3B82F6" />
                  <Bar dataKey="Organic" fill="#10B981" />
                  <Bar dataKey="Non-Recyclable" fill="#6B7280" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Waste Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="text-green-600" size={20} />
                <span>Waste Distribution</span>
              </CardTitle>
              <CardDescription>Total waste breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-8">
                <ResponsiveContainer width="60%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.value} items</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bin Usage Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="text-purple-600" size={20} />
              <span>Bin Fill Level Timeline</span>
            </CardTitle>
            <CardDescription>Bin capacity usage throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={binLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="level" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>AI-generated insights from your waste data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Recycling Performance</h3>
                <p className="text-blue-800 text-sm">
                  Recyclable waste accounts for 43% of total waste, indicating good sorting habits. 
                  Consider promoting recycling awareness to increase this percentage.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Peak Usage Hours</h3>
                <p className="text-green-800 text-sm">
                  Bin usage peaks between 12-16:00. Consider scheduling collections during 
                  off-peak hours for optimal efficiency.
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">Weekly Trend</h3>
                <p className="text-orange-800 text-sm">
                  Weekend waste volume is 25% higher than weekdays. Plan for increased 
                  capacity during weekend periods.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">ML Model Accuracy</h3>
                <p className="text-purple-800 text-sm">
                  Current classification accuracy is 89%. Consider retraining the model 
                  with additional data to improve performance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
