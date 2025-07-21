import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { MusicPlayerProvider } from "@/components/MusicPlayer";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Library from "@/pages/Library";
import Subscribe from "@/pages/Subscribe";
import Playlist from "@/pages/Playlist";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotify-dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  return (
    <MusicPlayerProvider>
      <div className="h-screen flex flex-col bg-spotify-dark">
        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          <Sidebar />
          
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
              <div className="w-64 bg-spotify-dark h-full" onClick={(e) => e.stopPropagation()}>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 bg-spotify-gray overflow-hidden flex flex-col">
            <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex-1 overflow-y-auto">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/search" component={Search} />
                <Route path="/library" component={Library} />
                <Route path="/subscribe" component={Subscribe} />
                <Route path="/playlist/:id" component={Playlist} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </main>
        </div>
        
        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </MusicPlayerProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
