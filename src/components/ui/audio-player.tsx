import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  currentSong?: {
    id: number;
    title: string;
    artist: string;
    imageUrl: string;
    duration: number;
  };
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  currentTime: number;
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
}

export function AudioPlayer({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  currentTime,
  volume,
  onVolumeChange,
  className,
}: AudioPlayerProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = currentSong ? (currentTime / currentSong.duration) * 100 : 0;

  if (!currentSong) {
    return null;
  }

  return (
    <div className={cn("bg-spotify-gray border-t border-spotify-light-gray px-4 py-3", className)}>
      <div className="flex items-center justify-between">
        {/* Current Track Info */}
        <div className="flex items-center space-x-3 w-1/4">
          <img
            src={currentSong.imageUrl}
            alt={currentSong.title}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm truncate text-white">{currentSong.title}</h4>
            <p className="text-spotify-text text-xs truncate">{currentSong.artist}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className="text-spotify-text hover:text-white"
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-spotify-green text-spotify-green")} />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShuffled(!isShuffled)}
              className={cn("text-spotify-text hover:text-white", isShuffled && "text-spotify-green")}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPrevious}
              className="text-spotify-text hover:text-white"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPlayPause}
              className="bg-white text-black w-10 h-10 rounded-full hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNext}
              className="text-spotify-text hover:text-white"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all'];
                const currentIndex = modes.indexOf(repeatMode);
                const nextIndex = (currentIndex + 1) % modes.length;
                setRepeatMode(modes[nextIndex]);
              }}
              className={cn("text-spotify-text hover:text-white", repeatMode !== 'off' && "text-spotify-green")}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-spotify-text">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1 bg-spotify-light-gray rounded-full h-1 relative">
              <div
                className="bg-white rounded-full h-1 relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-pointer" />
              </div>
            </div>
            <span>{formatTime(currentSong.duration)}</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center space-x-3 w-1/4 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-spotify-text hover:text-white"
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          <div className="w-20">
            <Slider
              value={[volume]}
              onValueChange={(value) => onVolumeChange(value[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
