import { useParams } from "wouter";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { StreamPlayer } from "../components/StreamPlayer";
import { NFTReward } from "../components/NFTReward";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { io } from "socket.io-client";
import { BackButton } from "../components/BackButton";

export default function Stream() {
  const { id } = useParams();
  const { data: stream, mutate } = useSWR(`/api/streams/${id}`);
  const { data: user } = useSWR(stream ? `/api/users/${stream.creatorId}` : null);
  const [viewTime, setViewTime] = useState(0);
  const [isParticipant, setIsParticipant] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!stream) return;

    const socket = io();
    socket.emit("join-stream", stream.id);

    socket.on("stream-updated", (data) => {
      mutate({ ...stream, ...data });
    });

    // Track view time
    const interval = setInterval(() => {
      if (stream.status === "live") {
        setViewTime(prev => prev + 1);
      }
    }, 1000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [stream]);

  useEffect(() => {
    if (stream?.status === "live" && !isParticipant) {
      fetch(`/api/streams/${id}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "current-user-id" }), // In real app, get from auth
      })
        .then(res => res.json())
        .then(() => setIsParticipant(true))
        .catch(console.error);
    }
  }, [stream?.status]);

  if (!stream || !user) return <div>Loading...</div>;

  const isEligibleForNFT = viewTime >= 300; // 5 minutes minimum view time

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6">
      <BackButton />
      <div className="lg:col-span-2 space-y-6">
        <StreamPlayer
          streamId={stream.id}
          isHost={false}
        />
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{stream.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.displayName}</p>
            </div>
          </CardHeader>
          <CardContent>
            <p>{stream.description}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <NFTReward
          streamId={stream.id}
          participantId={1} // In real app, get from participant record
          isEligible={isEligibleForNFT}
        />

        <Card>
          <CardHeader>
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {/* Chat messages would go here */}
                <p className="text-center text-sm text-muted-foreground">
                  Chat messages will appear here
                </p>
              </div>
            </ScrollArea>
            
            <div className="mt-4 flex gap-2">
              <Input placeholder="Type a message..." />
              <Button>Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
