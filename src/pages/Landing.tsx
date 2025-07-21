import { Music, Users, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-dark via-spotify-gray to-spotify-dark">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <Music className="h-16 w-16 text-spotify-green mr-4" />
            <h1 className="text-6xl font-bold text-white">Music Stream</h1>
          </div>
          <p className="text-xl text-spotify-text max-w-2xl mx-auto">
            Discover millions of songs, create playlists, and connect with music lovers worldwide.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-spotify-light-gray border-none p-8 text-center">
            <Heart className="h-12 w-12 text-spotify-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Personalized Playlists</h3>
            <p className="text-spotify-text">
              Get music recommendations tailored to your taste with our AI-powered discovery engine.
            </p>
          </Card>
          
          <Card className="bg-spotify-light-gray border-none p-8 text-center">
            <Users className="h-12 w-12 text-spotify-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Social Features</h3>
            <p className="text-spotify-text">
              Share your favorite tracks, follow friends, and discover what others are listening to.
            </p>
          </Card>
          
          <Card className="bg-spotify-light-gray border-none p-8 text-center">
            <Shield className="h-12 w-12 text-spotify-green mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Premium Quality</h3>
            <p className="text-spotify-text">
              Enjoy high-quality audio streaming with offline downloads and ad-free listening.
            </p>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            onClick={() => window.location.href = "/api/login"}
            className="bg-spotify-green text-black hover:bg-green-400 px-8 py-4 text-lg font-semibold rounded-full"
          >
            Get Started for Free
          </Button>
          <p className="text-spotify-text mt-4">
            Join millions of music lovers already using Music Stream
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-spotify-green">50M+</div>
            <div className="text-spotify-text">Songs</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-spotify-green">10M+</div>
            <div className="text-spotify-text">Artists</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-spotify-green">100M+</div>
            <div className="text-spotify-text">Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-spotify-green">180+</div>
            <div className="text-spotify-text">Countries</div>
          </div>
        </div>
      </div>
    </div>
  );
}
