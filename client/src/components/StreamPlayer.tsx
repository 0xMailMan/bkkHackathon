import { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { setupWebRTC } from "../lib/webrtc";

interface StreamPlayerProps {
  streamId: string;
  isHost?: boolean;
}

export function StreamPlayer({ streamId, isHost = false }: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function initStream() {
      try {
        const stream = await setupWebRTC(streamId, isHost);
        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          setIsLoading(false);
        }
      } catch (err) {
        setError("Failed to connect to stream");
        setIsLoading(false);
      }
    }

    initStream();

    return () => {
      // Cleanup WebRTC connections
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [streamId, isHost]);

  return (
    <Card className="relative aspect-video overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="w-full h-full"
        autoPlay
        playsInline
        controls={!isHost}
      />
    </Card>
  );
}
