import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PlaylistCardProps {
  playlist: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    songCount?: number;
  };
  onPlay: (playlist: any) => void;
  className?: string;
}

export function PlaylistCard({ playlist, onPlay, className }: PlaylistCardProps) {
  return (
    <Card className={cn("bg-spotify-light-gray hover:bg-spotify-text/20 rounded-lg p-4 cursor-pointer transition-colors group border-none", className)}>
      <div className="relative">
        <img
          src={playlist.imageUrl}
          alt={playlist.name}
          className="w-full aspect-square object-cover rounded-lg mb-3"
        />
        <Button
          onClick={() => onPlay(playlist)}
          className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-spotify-green text-black w-12 h-12 rounded-full hover:scale-105 transform p-0"
        >
          <Play className="h-5 w-5 ml-0.5" />
        </Button>
      </div>
      <div>
        <h3 className="font-semibold mb-1 text-white truncate">{playlist.name}</h3>
        <p className="text-spotify-text text-sm mb-3 line-clamp-2">{playlist.description}</p>
        {playlist.songCount && (
          <p className="text-spotify-text text-xs">{playlist.songCount} songs</p>
        )}
      </div>
    </Card>
  );
}
