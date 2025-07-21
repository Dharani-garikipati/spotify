import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, Music, User, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlbumCard } from "@/components/AlbumCard";
import { PlaylistCard } from "@/components/PlaylistCard";
import { useMusicPlayer } from "@/components/MusicPlayer";
import { mockSongs, mockPlaylists } from "@/lib/mockData";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const { playSong } = useMusicPlayer();

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/search', searchQuery],
    enabled: searchQuery.length > 0,
    queryFn: async () => {
      if (!searchQuery) return { songs: [], playlists: [] };
      
      // For demo purposes, filter mock data
      const songs = mockSongs.filter(song => 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      const playlists = mockPlaylists.filter(playlist =>
        playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return { songs, playlists };
    },
  });

  const handlePlaySong = (song: any) => {
    playSong(song, mockSongs);
  };

  const handlePlayPlaylist = (playlist: any) => {
    playSong(mockSongs[0], mockSongs);
  };

  const genres = [
    { name: "Pop", color: "bg-purple-500", icon: Music },
    { name: "Hip-Hop", color: "bg-orange-500", icon: Music },
    { name: "Rock", color: "bg-red-500", icon: Music },
    { name: "Jazz", color: "bg-blue-500", icon: Music },
    { name: "Electronic", color: "bg-green-500", icon: Music },
    { name: "Country", color: "bg-yellow-500", icon: Music },
    { name: "R&B", color: "bg-pink-500", icon: Music },
    { name: "Classical", color: "bg-indigo-500", icon: Music },
  ];

  return (
    <div className="p-6 pb-32">
      {/* Search Header */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-text h-5 w-5" />
          <Input
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-black rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-spotify-green border-none text-lg"
          />
        </div>
      </div>

      {searchQuery ? (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Search results for "{searchQuery}"</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full mx-auto" />
              <p className="text-spotify-text mt-4">Searching...</p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-spotify-light-gray border-none mb-6">
                <TabsTrigger value="all" className="data-[state=active]:bg-spotify-green data-[state=active]:text-black">
                  All
                </TabsTrigger>
                <TabsTrigger value="songs" className="data-[state=active]:bg-spotify-green data-[state=active]:text-black">
                  Songs
                </TabsTrigger>
                <TabsTrigger value="playlists" className="data-[state=active]:bg-spotify-green data-[state=active]:text-black">
                  Playlists
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-8">
                {searchResults?.songs && searchResults.songs.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Songs</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {searchResults.songs.slice(0, 6).map((song) => (
                        <AlbumCard
                          key={song.id}
                          album={song}
                          onPlay={handlePlaySong}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {searchResults?.playlists && searchResults.playlists.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4">Playlists</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {searchResults.playlists.slice(0, 4).map((playlist) => (
                        <PlaylistCard
                          key={playlist.id}
                          playlist={playlist}
                          onPlay={handlePlayPlaylist}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {(!searchResults?.songs?.length && !searchResults?.playlists?.length) && (
                  <div className="text-center py-12">
                    <SearchIcon className="h-16 w-16 text-spotify-text mx-auto mb-4" />
                    <p className="text-spotify-text text-lg">No results found for "{searchQuery}"</p>
                    <p className="text-spotify-text text-sm mt-2">Try different keywords or check your spelling</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="songs">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {searchResults?.songs?.map((song) => (
                    <AlbumCard
                      key={song.id}
                      album={song}
                      onPlay={handlePlaySong}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="playlists">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults?.playlists?.map((playlist) => (
                    <PlaylistCard
                      key={playlist.id}
                      playlist={playlist}
                      onPlay={handlePlayPlaylist}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Browse all</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {genres.map((genre) => (
              <Card
                key={genre.name}
                className={`${genre.color} border-none rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => setSearchQuery(genre.name)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white text-lg">{genre.name}</h3>
                  <genre.icon className="h-8 w-8 text-white opacity-80" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
