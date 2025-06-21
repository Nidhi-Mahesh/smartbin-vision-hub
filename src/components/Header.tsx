
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Database, TrendingUp, Camera, Settings, Home } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/dashboard", label: "Dashboard", icon: Database },
    { path: "/history", label: "History", icon: Camera },
    { path: "/analytics", label: "Analytics", icon: TrendingUp },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Database className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-900">SmartBin</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive(item.path) 
                      ? "bg-blue-600 text-white" 
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>

          <Link to="/login">
            <Button variant="outline" className="flex items-center space-x-2">
              <Settings size={16} />
              <span>Admin</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex overflow-x-auto space-x-2 pb-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 whitespace-nowrap ${
                  isActive(item.path) 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600"
                }`}
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
