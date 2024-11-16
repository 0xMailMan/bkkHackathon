import { useParams } from "wouter";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { StreamCard } from "../components/StreamCard";
import { Pencil, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "../hooks/use-toast";
import { BackButton } from "../components/BackButton";

interface ProfileFormData {
  displayName: string;
  bio: string;
  avatarUrl: string;
}

export default function Profile() {
  const { id } = useParams();
  const { data: user, mutate } = useSWR(`/api/users/${id}`);
  const { data: streams } = useSWR(`/api/streams?creatorId=${id}`);
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    defaultValues: {
      displayName: user?.displayName || "",
      bio: user?.bio || "",
      avatarUrl: user?.avatarUrl || "",
    }
  });

  const pastStreams = streams?.filter(s => s.status === "ended") || [];
  const upcomingStreams = streams?.filter(s => s.status === "scheduled") || [];

  const isOwnProfile = id === "me"; // In a real app, check against authenticated user ID

  async function onSubmit(data: ProfileFormData) {
    try {
      await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      await mutate();
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  }

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {!isOwnProfile && <BackButton />}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback>{user.displayName?.[0] || user.username[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{user.displayName || user.username}</h1>
              <p className="text-muted-foreground mt-2">{user.bio || "No bio yet"}</p>
              
              <div className="mt-4 flex gap-4 justify-center md:justify-start">
                {isOwnProfile ? (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <div>
                            <Input
                              placeholder="Display Name"
                              {...form.register("displayName")}
                            />
                          </div>
                          <div>
                            <Textarea
                              placeholder="Bio"
                              {...form.register("bio")}
                            />
                          </div>
                          <div>
                            <Input
                              placeholder="Avatar URL"
                              {...form.register("avatarUrl")}
                            />
                          </div>
                          <Button type="submit" className="w-full">
                            Save Changes
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                    
                    <Button>
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Stream
                    </Button>
                  </>
                ) : (
                  <Button>Follow</Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming Streams</TabsTrigger>
          <TabsTrigger value="past">Past Streams</TabsTrigger>
        </TabsList>
        
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
        
        <TabsContent value="past" className="mt-6">
          {pastStreams.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastStreams.map(stream => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No past streams</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
