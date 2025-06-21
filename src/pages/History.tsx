
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Filter, Download, Camera } from "lucide-react";
import Header from "@/components/Header";

const History = () => {
  const [filterLabel, setFilterLabel] = useState("all");
  const [dateRange, setDateRange] = useState("");

  // Sample data - in real app this would come from Firebase/API
  const historyData = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop",
      label: "Recyclable",
      confidence: 0.94,
      timestamp: "2025-06-21T10:30:00Z"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop",
      label: "Organic",
      confidence: 0.87,
      timestamp: "2025-06-21T09:15:00Z"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&h=200&fit=crop",
      label: "Non-Recyclable",
      confidence: 0.92,
      timestamp: "2025-06-21T08:45:00Z"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=300&h=200&fit=crop",
      label: "Recyclable",
      confidence: 0.89,
      timestamp: "2025-06-21T07:20:00Z"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop",
      label: "Organic",
      confidence: 0.76,
      timestamp: "2025-06-20T18:30:00Z"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop",
      label: "Non-Recyclable",
      confidence: 0.88,
      timestamp: "2025-06-20T16:10:00Z"
    }
  ];

  const getPredictionColor = (label: string) => {
    switch (label) {
      case "Recyclable": return "bg-blue-100 text-blue-800";
      case "Organic": return "bg-green-100 text-green-800";
      case "Non-Recyclable": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredData = historyData.filter(item => {
    if (filterLabel !== "all" && item.label !== filterLabel) return false;
    // Add date filtering logic here if needed
    return true;
  });

  const exportToCSV = () => {
    const csvContent = [
      ["ID", "Label", "Confidence", "Timestamp"],
      ...filteredData.map(item => [
        item.id,
        item.label,
        item.confidence,
        item.timestamp
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "smartbin-history.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trash Classification History</h1>
            <p className="text-gray-600 mt-2">Browse and analyze past waste classifications</p>
          </div>
          
          <Button onClick={exportToCSV} className="flex items-center space-x-2">
            <Download size={16} />
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="text-blue-600" size={20} />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Label
                </label>
                <Select value={filterLabel} onValueChange={setFilterLabel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Recyclable">Recyclable</SelectItem>
                    <SelectItem value="Organic">Organic</SelectItem>
                    <SelectItem value="Non-Recyclable">Non-Recyclable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <Input
                  type="date"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setFilterLabel("all");
                    setDateRange("");
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredData.length} of {historyData.length} records
          </p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Predicted Label</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Confidence</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <img 
                              src={item.image} 
                              alt={`Classification ${item.id}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getPredictionColor(item.label)}>
                            {item.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{Math.round(item.confidence * 100)}%</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-blue-600 rounded-full"
                                style={{ width: `${item.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(item.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredData.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={`Classification ${item.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={getPredictionColor(item.label)}>
                        {item.label}
                      </Badge>
                      <span className="text-sm font-medium">{Math.round(item.confidence * 100)}%</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <Calendar size={12} className="inline mr-1" />
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Camera className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default History;
