
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Database, TrendingUp, Camera, Settings, Home, LogOut, Shield } from "lucide-react";
import { useState, useEffect } from "react";

const Header = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const adminAuth = localStorage.getItem("smartbin_admin");
    setIsLoggedIn(adminAuth === "true");
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("smartbin_admin");
    setIsLoggedIn(false);
    window.location.href = "/";
  };
  
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

          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <Link to="/admin">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Shield size={16} />
                    <span>Admin Panel</span>
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="flex items-center space-x-2">
                  <Settings size={16} />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
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
          {isLoggedIn && (
            <Link to="/admin">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 whitespace-nowrap text-gray-600"
              >
                <Shield size={14} />
                <span>Admin</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
