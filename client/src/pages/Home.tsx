import { useState } from "react";
import { useLocation } from "wouter";
import useSWR from "swr";
import { StreamCard } from "../components/StreamCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export default function Home() {
  const [activeTab, setActiveTab] = useState("live");
  const { data: streams } = useSWR("/api/streams");
  const [, setLocation] = useLocation();

  const liveStreams = streams?.filter(stream => stream.status === "live") || [];
  const upcomingStreams = streams?.filter(stream => stream.status === "scheduled") || [];

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">
          Welcome to NEXT<span className="font-bold">Hype</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join the next generation of content creators. Stream live, engage with your audience, 
          and earn unique NFT rewards on the Gnosis Network.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => setLocation("/explore")}>
            Discover Creators
          </Button>
          <Button size="lg" variant="outline" onClick={() => setLocation("/schedule")}>
            View Schedule
          </Button>
        </div>
      </section>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto">
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="upcoming">Coming Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="live" className="mt-6">
          {liveStreams.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {liveStreams.map(stream => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No live streams at the moment</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-6">
          {upcomingStreams.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingStreams.map(stream => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No upcoming streams scheduled</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <section className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle>Why NEXT<span className="font-bold">Hype</span>?</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Live Streaming</h3>
              <p className="text-sm text-muted-foreground">
                High-quality, low-latency streaming powered by WebRTC technology.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">NFT Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Earn unique NFTs on Gnosis Network for participating in streams.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Creator Tools</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive tools for scheduling and managing your content.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
