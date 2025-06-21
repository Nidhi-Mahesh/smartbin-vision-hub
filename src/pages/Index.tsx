
import { ArrowDown, Database, TrendingUp, Camera, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Index = () => {
  const features = [
    {
      icon: Database,
      title: "Real-time Monitoring",
      description: "Live tracking of bin fill levels for both organic and inorganic waste with instant alerts when bins reach capacity."
    },
    {
      icon: Camera,
      title: "AI Waste Classifier",
      description: "Use your phone camera to classify waste as biodegradable or non-biodegradable with advanced machine learning."
    },
    {
      icon: BarChart3,
      title: "Data History & Analytics",
      description: "Comprehensive tracking of waste patterns, usage trends, and detailed analytics for better waste management."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            SmartBin
            <span className="block text-green-600">Intelligent Waste Monitoring</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Monitor waste levels in real-time, classify trash with AI-powered camera detection, 
            and optimize waste collection for a sustainable future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/dashboard">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                View Dashboard
              </Button>
            </Link>
            <Link to="/camera-classifier">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                Try AI Sorter
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline" size="lg" className="border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg">
                See Analytics
              </Button>
            </Link>
          </div>

          <div className="animate-bounce">
            <ArrowDown className="mx-auto text-gray-400" size={24} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Key Features
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Our smart bin system combines IoT sensors with AI-powered classification 
            to create the most advanced waste management solution.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="text-white" size={28} />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Project Goals Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
              <p className="text-green-100">Optimize waste sorting and reduce environmental impact through intelligent monitoring and classification.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Automation</h3>
              <p className="text-blue-100">Eliminate manual monitoring with real-time sensor data and automated alerts for efficient waste management.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Smart Cities</h3>
              <p className="text-purple-100">Enable data-driven decisions for efficient urban waste management systems and cleaner communities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">SmartBin</h3>
          <p className="text-gray-400 mb-6">Building a sustainable future through intelligent waste management</p>
          <div className="flex justify-center space-x-8">
            <Link to="/dashboard" className="text-gray-400 hover:text-green-400 transition-colors">Dashboard</Link>
            <Link to="/analytics" className="text-gray-400 hover:text-green-400 transition-colors">Analytics</Link>
            <Link to="/history" className="text-gray-400 hover:text-green-400 transition-colors">History</Link>
            <Link to="/camera-classifier" className="text-gray-400 hover:text-green-400 transition-colors">AI Classifier</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
