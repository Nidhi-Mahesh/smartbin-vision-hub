
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar, Filter, Download, Leaf, Recycle } from "lucide-react";
import Header from "@/components/Header";

const History = () => {
  const [filterBinType, setFilterBinType] = useState("all");
  const [dateRange, setDateRange] = useState("");

  // Sample data - bin fill events instead of image classifications
  const historyData = [
    {
      id: 1,
      binType: "Organic",
      fillLevel: 67,
      timestamp: "2025-06-21T10:30:00Z",
      eventType: "Fill Level Update"
    },
    {
      id: 2,
      binType: "Inorganic",
      fillLevel: 45,
      timestamp: "2025-06-21T09:15:00Z",
      eventType: "Fill Level Update"
    },
    {
      id: 3,
      binType: "Organic",
      fillLevel: 92,
      timestamp: "2025-06-21T08:45:00Z",
      eventType: "Alert Triggered"
    },
    {
      id: 4,
      binType: "Inorganic",
      fillLevel: 78,
      timestamp: "2025-06-21T07:20:00Z",
      eventType: "Fill Level Update"
    },
    {
      id: 5,
      binType: "Organic",
      fillLevel: 0,
      timestamp: "2025-06-20T18:30:00Z",
      eventType: "Bin Emptied"
    },
    {
      id: 6,
      binType: "Inorganic",
      fillLevel: 15,
      timestamp: "2025-06-20T16:10:00Z",
      eventType: "Fill Level Update"
    }
  ];

  const getBinIcon = (binType: string) => {
    return binType === "Organic" ? Leaf : Recycle;
  };

  const getBinColor = (binType: string) => {
    return binType === "Organic" 
      ? "bg-green-100 text-green-800" 
      : "bg-blue-100 text-blue-800";
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "Alert Triggered": return "bg-red-100 text-red-800";
      case "Bin Emptied": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredData = historyData.filter(item => {
    if (filterBinType !== "all" && item.binType !== filterBinType) return false;
    // Add date filtering logic here if needed
    return true;
  });

  const exportToCSV = () => {
    const csvContent = [
      ["ID", "Bin Type", "Fill Level %", "Event Type", "Timestamp"],
      ...filteredData.map(item => [
        item.id,
        item.binType,
        item.fillLevel,
        item.eventType,
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
            <h1 className="text-3xl font-bold text-gray-900">Bin Fill History</h1>
            <p className="text-gray-600 mt-2">Timeline of bin fill events and alerts</p>
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
                  Filter by Bin Type
                </label>
                <Select value={filterBinType} onValueChange={setFilterBinType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bin type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bins</SelectItem>
                    <SelectItem value="Organic">Organic</SelectItem>
                    <SelectItem value="Inorganic">Inorganic</SelectItem>
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
                    setFilterBinType("all");
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
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Bin Type</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Fill Level</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Event Type</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredData.map((item) => {
                      const BinIcon = getBinIcon(item.binType);
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <BinIcon className={item.binType === "Organic" ? "text-green-600" : "text-blue-600"} size={20} />
                              <Badge className={getBinColor(item.binType)}>
                                {item.binType}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{item.fillLevel}%</span>
                              <div className="w-16 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className={`h-2 rounded-full ${
                                    item.fillLevel < 60 ? 'bg-green-500' : 
                                    item.fillLevel < 90 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${item.fillLevel}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={getEventColor(item.eventType)}>
                              {item.eventType}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(item.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredData.map((item) => {
            const BinIcon = getBinIcon(item.binType);
            return (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <BinIcon className={item.binType === "Organic" ? "text-green-600" : "text-blue-600"} size={20} />
                        <Badge className={getBinColor(item.binType)}>
                          {item.binType}
                        </Badge>
                      </div>
                      <span className="text-lg font-medium">{item.fillLevel}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={getEventColor(item.eventType)}>
                        {item.eventType}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <Calendar size={12} className="inline mr-1" />
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredData.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
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
