import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Play, Pause, Heart, MoreHorizontal, Clock, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicPlayer } from "@/components/MusicPlayer";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDuration } from "@/lib/mockData";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Playlist() {
  const { id } = useParams();
  const { user } = useAuth();
  const { playSong, currentSong, isPlaying } = useMusicPlayer();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);

  const { data: playlist, isLoading: playlistLoading } = useQuery({
    queryKey: ['/api/playlists', id],
    enabled: !!id,
  });

  const { data: playlistSongs = [], isLoading: songsLoading } = useQuery({
    queryKey: ['/api/playlists', id, 'songs'],
    enabled: !!id,
  });

  const likeSongMutation = useMutation({
    mutationFn: async (songId: number) => {
      return await apiRequest("POST", "/api/liked-songs", { songId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/liked-songs'] });
      toast({
        title: "Success",
        description: "Added to Liked Songs",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to like song",
        variant: "destructive",
      });
    },
  });

  const handlePlayPlaylist = () => {
    if (playlistSongs.length > 0) {
      const songs = playlistSongs.map((ps: any) => ps.song);
      playSong(songs[0], songs);
    }
  };

  const handlePlaySong = (song: any, index: number) => {
    const songs = playlistSongs.map((ps: any) => ps.song);
    playSong(song, songs);
  };

  const handleLikeSong = (songId: number) => {
    likeSongMutation.mutate(songId);
  };

  const isCurrentSongPlaying = (songId: number) => {
    return currentSong?.id === songId && isPlaying;
  };

  if (playlistLoading) {
    return (
      <div className="p-6 pb-32">
        <div className="animate-pulse">
          <div className="flex items-end space-x-6 mb-8">
            <div className="w-60 h-60 bg-spotify-light-gray rounded-lg" />
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-spotify-light-gray rounded w-3/4" />
              <div className="h-6 bg-spotify-light-gray rounded w-1/2" />
              <div className="h-4 bg-spotify-light-gray rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="p-6 pb-32">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Playlist not found</h2>
          <p className="text-spotify-text">The playlist you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-32">
      {/* Playlist Header */}
      <div className="flex items-end space-x-6 mb-8">
        <div className="w-60 h-60 bg-gradient-to-br from-purple-500 to-spotify-green rounded-lg flex items-center justify-center">
          {playlist.imageUrl ? (
            <img
              src={playlist.imageUrl}
              alt={playlist.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-white text-6xl font-bold">
              {playlist.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-white font-medium mb-2">PLAYLIST</p>
          <h1 className="text-5xl font-bold text-white mb-4 break-words">
            {playlist.name}
          </h1>
          {playlist.description && (
            <p className="text-spotify-text mb-4">{playlist.description}</p>
          )}
          <div className="flex items-center space-x-2 text-sm text-spotify-text">
            <span className="text-white font-medium">
              {user?.firstName || "User"}
            </span>
            <span>•</span>
            <span>{playlistSongs.length} songs</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-6 mb-8">
        <Button
          onClick={handlePlayPlaylist}
          className="bg-spotify-green text-black hover:bg-green-400 w-14 h-14 rounded-full p-0"
          disabled={playlistSongs.length === 0}
        >
          <Play className="h-6 w-6 ml-0.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsLiked(!isLiked)}
          className="text-spotify-text hover:text-white"
        >
          <Heart className={`h-8 w-8 ${isLiked ? 'fill-spotify-green text-spotify-green' : ''}`} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-spotify-text hover:text-white"
        >
          <Download className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-spotify-text hover:text-white"
        >
          <Share className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-spotify-text hover:text-white"
        >
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>

      {/* Songs Table */}
      {songsLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-spotify-green border-t-transparent rounded-full mx-auto" />
          <p className="text-spotify-text mt-4">Loading songs...</p>
        </div>
      ) : playlistSongs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-2xl font-bold text-white mb-4">No songs in this playlist</h3>
          <p className="text-spotify-text">Start building your playlist by searching for songs you love.</p>
        </div>
      ) : (
        <div className="bg-spotify-light-gray/20 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-spotify-light-gray hover:bg-transparent">
                <TableHead className="w-12 text-spotify-text">#</TableHead>
                <TableHead className="text-spotify-text">Title</TableHead>
                <TableHead className="text-spotify-text">Album</TableHead>
                <TableHead className="text-spotify-text">Date added</TableHead>
                <TableHead className="w-12 text-spotify-text">
                  <Clock className="h-4 w-4" />
                </TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playlistSongs.map((playlistSong: any, index: number) => {
                const song = playlistSong.song;
                const isCurrentPlaying = isCurrentSongPlaying(song.id);
                
                return (
                  <TableRow
                    key={song.id}
                    className="border-none hover:bg-spotify-light-gray/30 cursor-pointer group"
                    onClick={() => handlePlaySong(song, index)}
                  >
                    <TableCell className="font-medium text-spotify-text group-hover:text-white">
                      <div className="flex items-center justify-center w-6 h-6">
                        {isCurrentPlaying ? (
                          <div className="w-4 h-4 bg-spotify-green rounded-full animate-pulse" />
                        ) : (
                          <span className="group-hover:hidden">{index + 1}</span>
                        )}
                        <Play className="h-4 w-4 hidden group-hover:block text-white" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img
                          src={song.imageUrl}
                          alt={song.title}
                          className="w-10 h-10 rounded"
                        />
                        <div>
                          <p className={`font-medium ${isCurrentPlaying ? 'text-spotify-green' : 'text-white'}`}>
                            {song.title}
                          </p>
                          <p className="text-sm text-spotify-text">{song.artist}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-spotify-text group-hover:text-white">
                      {song.album}
                    </TableCell>
                    <TableCell className="text-spotify-text group-hover:text-white">
                      {new Date(playlistSong.addedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-spotify-text group-hover:text-white">
                      {formatDuration(song.duration)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikeSong(song.id);
                          }}
                          className="text-spotify-text hover:text-white p-1"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-spotify-text hover:text-white p-1"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
