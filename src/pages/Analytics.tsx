
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Download, Calendar, BarChart3, PieChart, Clock, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';
import Header from "@/components/Header";

const Analytics = () => {
  // Sample data for charts
  const weeklyData = [
    { day: 'Mon', organic: 65, inorganic: 45 },
    { day: 'Tue', organic: 70, inorganic: 52 },
    { day: 'Wed', organic: 55, inorganic: 48 },
    { day: 'Thu', organic: 80, inorganic: 65 },
    { day: 'Fri', organic: 75, inorganic: 58 },
    { day: 'Sat', organic: 90, inorganic: 70 },
    { day: 'Sun', organic: 45, inorganic: 35 },
  ];

  const monthlyTrend = [
    { month: 'Jan', organic: 1200, inorganic: 800 },
    { month: 'Feb', organic: 1100, inorganic: 750 },
    { month: 'Mar', organic: 1300, inorganic: 900 },
    { month: 'Apr', organic: 1250, inorganic: 850 },
    { month: 'May', organic: 1400, inorganic: 950 },
    { month: 'Jun', organic: 1350, inorganic: 920 },
  ];

  const wasteDistribution = [
    { name: 'Organic', value: 65, color: '#22c55e' },
    { name: 'Inorganic', value: 35, color: '#3b82f6' },
  ];

  const fillRateData = [
    { time: '00:00', organic: 20, inorganic: 15 },
    { time: '04:00', organic: 25, inorganic: 18 },
    { time: '08:00', organic: 45, inorganic: 35 },
    { time: '12:00', organic: 70, inorganic: 55 },
    { time: '16:00', organic: 85, inorganic: 70 },
    { time: '20:00', organic: 90, inorganic: 75 },
  ];

  // Prediction data based on past trends
  const predictionData = {
    organic: {
      nextFillTime: "Tomorrow 2:30 PM",
      confidence: 87,
      trend: "increasing",
      avgDailyFill: 23.5
    },
    inorganic: {
      nextFillTime: "Day after tomorrow 11:15 AM", 
      confidence: 92,
      trend: "stable",
      avgDailyFill: 18.2
    }
  };

  const handleExportCSV = () => {
    const csvData = weeklyData.map(row => 
      `${row.day},${row.organic},${row.inorganic}`
    ).join('\n');
    const blob = new Blob([`Day,Organic,Inorganic\n${csvData}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'smartbin-analytics.csv';
    a.click();
  };

  const handleExportPDF = () => {
    // Placeholder for PDF export
    alert('PDF export would be implemented with a library like jsPDF');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Insights and trends from your SmartBin data</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button onClick={handleExportCSV} variant="outline" className="flex items-center space-x-2">
              <Download size={16} />
              <span>Export CSV</span>
            </Button>
            <Button onClick={handleExportPDF} variant="outline" className="flex items-center space-x-2">
              <Download size={16} />
              <span>Export PDF</span>
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Waste Today</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.5 kg</div>
              <p className="text-xs text-muted-foreground">+12% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Fill Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.1%/hr</div>
              <p className="text-xs text-muted-foreground">Stable trend</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14</div>
              <p className="text-xs text-muted-foreground">2 per day average</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">+2% this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Prediction Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="text-green-600" size={20} />
                <span>Next Fill Predictions</span>
              </CardTitle>
              <CardDescription>AI-powered predictions based on historical data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-800">Organic Bin 🍌</h4>
                    <Badge className="bg-green-600">{predictionData.organic.confidence}% confident</Badge>
                  </div>
                  <div className="text-sm text-green-700">
                    <div className="mb-1">
                      <Clock size={12} className="inline mr-1" />
                      Expected full: <strong>{predictionData.organic.nextFillTime}</strong>
                    </div>
                    <div className="mb-1">
                      <TrendingUp size={12} className="inline mr-1" />
                      Trend: <strong>{predictionData.organic.trend}</strong>
                    </div>
                    <div>
                      Daily avg: <strong>{predictionData.organic.avgDailyFill}% fill</strong>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-800">Inorganic Bin 🧴</h4>
                    <Badge className="bg-blue-600">{predictionData.inorganic.confidence}% confident</Badge>
                  </div>
                  <div className="text-sm text-blue-700">
                    <div className="mb-1">
                      <Clock size={12} className="inline mr-1" />
                      Expected full: <strong>{predictionData.inorganic.nextFillTime}</strong>
                    </div>
                    <div className="mb-1">
                      <TrendingUp size={12} className="inline mr-1" />
                      Trend: <strong>{predictionData.inorganic.trend}</strong>
                    </div>
                    <div>
                      Daily avg: <strong>{predictionData.inorganic.avgDailyFill}% fill</strong>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="text-blue-600" size={20} />
                <span>Waste Distribution</span>
              </CardTitle>
              <CardDescription>Overall waste composition this month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={wasteDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {wasteDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Fill Levels</CardTitle>
              <CardDescription>Daily maximum fill percentage for each bin</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="organic" stroke="#22c55e" strokeWidth={2} name="Organic %" />
                  <Line type="monotone" dataKey="inorganic" stroke="#3b82f6" strokeWidth={2} name="Inorganic %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Fill Pattern</CardTitle>
              <CardDescription>Fill levels throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fillRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="organic" fill="#22c55e" name="Organic %" />
                  <Bar dataKey="inorganic" fill="#3b82f6" name="Inorganic %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Waste Volume Trends</CardTitle>
            <CardDescription>Total waste collected per month (kg)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="organic" stroke="#22c55e" strokeWidth={3} name="Organic (kg)" />
                <Line type="monotone" dataKey="inorganic" stroke="#3b82f6" strokeWidth={3} name="Inorganic (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
