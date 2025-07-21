import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { AudioPlayer } from "@/components/ui/audio-player";
import { mockSongs } from "@/lib/mockData";

interface MusicPlayerContextType {
  currentSong: any;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  playQueue: any[];
  currentIndex: number;
  playSong: (song: any, queue?: any[]) => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  previousSong: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
};

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export function MusicPlayerProvider({ children }: MusicPlayerProviderProps) {
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(50);
  const [playQueue, setPlayQueue] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Simulate audio playback
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentSong.duration) {
            nextSong();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  const playSong = (song: any, queue?: any[]) => {
    setCurrentSong(song);
    setCurrentTime(0);
    setIsPlaying(true);
    if (queue) {
      setPlayQueue(queue);
      setCurrentIndex(queue.findIndex((s) => s.id === song.id));
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (playQueue.length > 0) {
      const nextIndex = (currentIndex + 1) % playQueue.length;
      setCurrentIndex(nextIndex);
      setCurrentSong(playQueue[nextIndex]);
      setCurrentTime(0);
    }
  };

  const previousSong = () => {
    if (playQueue.length > 0) {
      const prevIndex = currentIndex === 0 ? playQueue.length - 1 : currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(playQueue[prevIndex]);
      setCurrentTime(0);
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };

  const seek = (time: number) => {
    setCurrentTime(time);
  };

  const contextValue = {
    currentSong,
    isPlaying,
    currentTime,
    volume,
    playQueue,
    currentIndex,
    playSong,
    togglePlayPause,
    nextSong,
    previousSong,
    setVolume,
    seek,
  };

  return (
    <MusicPlayerContext.Provider value={contextValue}>
      {children}
      <AudioPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onNext={nextSong}
        onPrevious={previousSong}
        onSeek={seek}
        currentTime={currentTime}
        volume={volume}
        onVolumeChange={setVolume}
        className="fixed bottom-0 left-0 right-0 z-20"
      />
    </MusicPlayerContext.Provider>
  );
}
