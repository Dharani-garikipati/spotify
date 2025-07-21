import { useState } from "react";
import { ChevronLeft, ChevronRight, Search, Bell, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  onToggleSidebar?: () => void;
}

export function Header({ onSearch, searchQuery = "", onToggleSidebar }: HeaderProps) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoForward = () => {
    window.history.forward();
  };

  return (
    <header className="bg-spotify-gray/95 backdrop-blur-sm sticky top-0 z-10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="lg:hidden text-white hover:bg-spotify-light-gray"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="w-8 h-8 rounded-full bg-spotify-light-gray hover:bg-spotify-text/20 text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoForward}
              className="w-8 h-8 rounded-full bg-spotify-light-gray hover:bg-spotify-text/20 text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-text h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for songs, artists, albums..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              className="w-full bg-white text-black rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-spotify-green border-none"
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="bg-spotify-light-gray hover:bg-spotify-text/20 px-4 py-2 rounded-full text-sm transition-colors text-white"
          >
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </Button>
          <div className="flex items-center space-x-2 cursor-pointer hover:bg-spotify-light-gray rounded-full p-2 transition-colors">
            <img
              src={user?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"}
              alt="User profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="hidden sm:inline text-white">
              {user?.firstName || "User"}
            </span>
            <ChevronDown className="h-3 w-3 text-spotify-text" />
          </div>
        </div>
      </div>
    </header>
  );
}
