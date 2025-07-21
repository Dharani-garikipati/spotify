import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Grid, List, Music, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaylistCard } from "@/components/PlaylistCard";
import { AlbumCard } from "@/components/AlbumCard";
import { useMusicPlayer } from "@/components/MusicPlayer";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useAuth();
  const { playSong } = useMusicPlayer();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: playlists = [], isLoading: playlistsLoading } = useQuery({
    queryKey: ['/api/playlists'],
    enabled: !!user,
  });

  const { data: likedSongs = [], isLoading: likedSongsLoading } = useQuery({
    queryKey: ['/api/liked-songs'],
    enabled: !!user,
  });

  const { data: followedPlaylists = [], isLoading: followedPlaylistsLoading } = useQuery({
    queryKey: ['/api/followed-playlists'],
    enabled: !!user,
  });

  const createPlaylistMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/playlists", {
        name: "My New Playlist",
        description: "A new playlist created by me",
        isPublic: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/playlists'] });
      toast({
        title: "Success",
        description: "Playlist created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive",
      });
    },
  });

  const handlePlayPlaylist = (playlist: any) => {
    // In a real app, this would fetch the playlist's songs
    playSong(playlist, []);
  };

  const handlePlaySong = (song: any) => {
    playSong(song, likedSongs.map((ls: any) => ls.song));
  };

  const filteredPlaylists = playlists.filter((playlist: any) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLikedSongs = likedSongs.filter((likedSong: any) =>
    likedSong.song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    likedSong.song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFollowedPlaylists = followedPlaylists.filter((fp: any) =>
    fp.playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Your Library</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-text h-4 w-4" />
            <Input
              type="text"
              placeholder="Search in your library"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-spotify-light-gray text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-spotify-green border-none"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="text-spotify-text hover:text-white"
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card
          className="bg-spotify-light-gray hover:bg-spotify-text/20 rounded-lg p-4 flex items-center space-x-4 cursor-pointer transition-colors group border-none"
          onClick={() => createPlaylistMutation.mutate()}
        >
          <div className="w-12 h-12 bg-spotify-green rounded-lg flex items-center justify-center">
            <Plus className="h-6 w-6 text-black" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Create Playlist</h3>
            <p className="text-sm text-spotify-text">Make a new playlist</p>
          </div>
        </Card>

        <Link href="/liked">
          <Card className="bg-spotify-light-gray hover:bg-spotify-text/20 rounded-lg p-4 flex items-center space-x-4 cursor-pointer transition-colors group border-none">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Liked Songs</h3>
              <p className="text-sm text-spotify-text">{likedSongs.length} songs</p>
            </div>
          </Card>
        </Link>

        <Card className="bg-spotify-light-gray hover:bg-spotify-text/20 rounded-lg p-4 flex items-center space-x-4 cursor-pointer transition-colors group border-none">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <Music className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Recently Played</h3>
            <p className="text-sm text-spotify-text">Your listening history</p>
          </div>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="playlists" className="w-full">
        <TabsList className="bg-spotify-light-gray border-none mb-6">
          <TabsTrigger value="playlists" className="data-[state=active]:bg-spotify-green data-[state=active]:text-black">
            Playlists ({filteredPlaylists.length})
          </TabsTrigger>
          <TabsTrigger value="liked" className="data-[state=active]:bg-spotify-green data-[state=active]:text-black">
            Liked Songs ({filteredLikedSongs.length})
          </TabsTrigger>
          <TabsTrigger value="followed" className="data-[state=active]:bg-spotify-green data-[state=active]:text-black">
            Following ({filteredFollowedPlaylists.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="playlists">
          {playlistsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full mx-auto" />
              <p className="text-spotify-text mt-4">Loading playlists...</p>
            </div>
          ) : filteredPlaylists.length > 0 ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
              {filteredPlaylists.map((playlist: any) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onPlay={handlePlayPlaylist}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="h-16 w-16 text-spotify-text mx-auto mb-4" />
              <p className="text-spotify-text text-lg">No playlists found</p>
              <p className="text-spotify-text text-sm mt-2">Create your first playlist to get started</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="liked">
          {likedSongsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full mx-auto" />
              <p className="text-spotify-text mt-4">Loading liked songs...</p>
            </div>
          ) : filteredLikedSongs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredLikedSongs.map((likedSong: any) => (
                <AlbumCard
                  key={likedSong.id}
                  album={likedSong.song}
                  onPlay={handlePlaySong}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-spotify-text mx-auto mb-4" />
              <p className="text-spotify-text text-lg">No liked songs yet</p>
              <p className="text-spotify-text text-sm mt-2">Start liking songs to see them here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="followed">
          {followedPlaylistsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full mx-auto" />
              <p className="text-spotify-text mt-4">Loading followed playlists...</p>
            </div>
          ) : filteredFollowedPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFollowedPlaylists.map((fp: any) => (
                <PlaylistCard
                  key={fp.id}
                  playlist={fp.playlist}
                  onPlay={handlePlayPlaylist}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="h-16 w-16 text-spotify-text mx-auto mb-4" />
              <p className="text-spotify-text text-lg">No followed playlists</p>
              <p className="text-spotify-text text-sm mt-2">Follow playlists to see them here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
