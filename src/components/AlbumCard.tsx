import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AlbumCardProps {
  album: {
    id: number;
    title: string;
    artist: string;
    imageUrl: string;
    genre?: string;
  };
  onPlay: (album: any) => void;
  className?: string;
}

export function AlbumCard({ album, onPlay, className }: AlbumCardProps) {
  return (
    <Card className={cn("bg-spotify-light-gray hover:bg-spotify-text/20 rounded-lg p-4 cursor-pointer transition-colors group border-none", className)}>
      <div className="relative">
        <img
          src={album.imageUrl}
          alt={album.title}
          className="w-full aspect-square object-cover rounded-lg mb-3"
        />
        <Button
          onClick={() => onPlay(album)}
          className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-spotify-green text-black w-10 h-10 rounded-full hover:scale-105 transform p-0"
        >
          <Play className="h-4 w-4 ml-0.5" />
        </Button>
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-1 truncate text-white">{album.title}</h3>
        <p className="text-spotify-text text-xs truncate">{album.artist}</p>
        {album.genre && (
          <p className="text-spotify-text text-xs mt-1">{album.genre}</p>
        )}
      </div>
    </Card>
  );
}
