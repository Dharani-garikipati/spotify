import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Search, Library, Plus, Heart, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { PremiumModal } from "./PremiumModal";
import { useAuth } from "@/hooks/useAuth";

export function Sidebar() {
  const [location] = useLocation();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { user } = useAuth();

  const { data: playlists = [] } = useQuery({
    queryKey: ['/api/playlists'],
    enabled: !!user,
  });

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Library, label: "Your Library", href: "/library" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <>
      <aside className="w-64 bg-spotify-dark border-r border-spotify-light-gray p-6 hidden lg:block">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-spotify-green flex items-center">
            <Music className="mr-2" />
            Music Stream
          </h1>
        </div>
        
        <nav className="space-y-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center space-x-3 transition-colors py-2 px-3 rounded-lg",
                  isActive(item.href)
                    ? "text-white bg-spotify-light-gray"
                    : "text-spotify-text hover:text-white hover:bg-spotify-light-gray/50"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-spotify-light-gray">
          <Link href="/playlist/create">
            <a className="flex items-center space-x-3 text-spotify-text hover:text-white transition-colors py-2 px-3 rounded-lg">
              <Plus className="w-5 h-5" />
              <span>Create Playlist</span>
            </a>
          </Link>
          <Link href="/liked">
            <a className="flex items-center space-x-3 text-spotify-text hover:text-white transition-colors mt-4 py-2 px-3 rounded-lg">
              <Heart className="w-5 h-5" />
              <span>Liked Songs</span>
            </a>
          </Link>
        </div>

        <div className="mt-8 space-y-2">
          <div className="text-spotify-text text-sm">Recently Created</div>
          {playlists.slice(0, 3).map((playlist: any) => (
            <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
              <a className="block text-spotify-text hover:text-white transition-colors text-sm py-1 px-3 rounded">
                {playlist.name}
              </a>
            </Link>
          ))}
        </div>

        {/* Premium Upgrade Card */}
        {!user?.isPremium && (
          <Card className="mt-8 bg-gradient-to-br from-purple-500 to-spotify-green p-4 border-none">
            <h3 className="font-semibold mb-2 text-white">Go Premium</h3>
            <p className="text-sm text-white/80 mb-3">Unlimited skips, ad-free music</p>
            <Button
              onClick={() => setShowPremiumModal(true)}
              className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform w-full"
            >
              Upgrade Now
            </Button>
          </Card>
        )}
      </aside>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </>
  );
}
