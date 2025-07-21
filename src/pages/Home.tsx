import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlaylistCard } from "@/components/PlaylistCard";
import { AlbumCard } from "@/components/AlbumCard";
import { Play } from "lucide-react";
import { useMusicPlayer } from "@/components/MusicPlayer";
import { mockSongs, mockPlaylists, mockQuickAccess, mockTopCharts } from "@/lib/mockData";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const { playSong } = useMusicPlayer();

  const { data: playlists = [] } = useQuery({
    queryKey: ['/api/playlists'],
    enabled: !!user,
  });

  const { data: songs = [] } = useQuery({
    queryKey: ['/api/songs'],
    enabled: !!user,
  });

  const handlePlayPlaylist = (playlist: any) => {
    // In a real app, this would fetch the playlist's songs
    playSong(mockSongs[0], mockSongs);
  };

  const handlePlayAlbum = (album: any) => {
    playSong(album, mockSongs);
  };

  const handlePlayQuickAccess = (item: any) => {
    playSong(mockSongs[0], mockSongs);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-6 pb-32">
      {/* Hero Section */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-spotify-green rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">{getGreeting()}</h2>
          <p className="text-lg opacity-90">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! Here's what's new in your music world.
          </p>
        </div>
      </section>

      {/* Quick Access */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockQuickAccess.map((item) => (
            <Card
              key={item.id}
              className="bg-spotify-light-gray hover:bg-spotify-text/20 rounded-lg p-4 flex items-center space-x-4 cursor-pointer transition-colors group border-none"
              onClick={() => handlePlayQuickAccess(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-white">{item.name}</h3>
                <p className="text-sm text-spotify-text">{item.songCount} songs</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2"
              >
                <Play className="h-6 w-6 text-spotify-green" />
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Recently Played</h2>
          <Button
            variant="ghost"
            className="text-spotify-text hover:text-white text-sm"
          >
            Show all
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {mockSongs.slice(0, 6).map((song) => (
            <AlbumCard
              key={song.id}
              album={song}
              onPlay={handlePlayAlbum}
            />
          ))}
        </div>
      </section>

      {/* Made For You */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Made for You</h2>
          <Button
            variant="ghost"
            className="text-spotify-text hover:text-white text-sm"
          >
            Show all
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockPlaylists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onPlay={handlePlayPlaylist}
            />
          ))}
        </div>
      </section>

      {/* Top Charts */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Top Charts</h2>
          <Button
            variant="ghost"
            className="text-spotify-text hover:text-white text-sm"
          >
            Show all
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockTopCharts.map((chart) => (
            <PlaylistCard
              key={chart.id}
              playlist={chart}
              onPlay={handlePlayPlaylist}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
