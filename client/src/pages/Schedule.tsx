import { useState } from "react";
import useSWR from "swr";
import { Calendar } from "../components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useForm } from "react-hook-form";
import { useToast } from "../hooks/use-toast";
import { format } from "date-fns";
import { BackButton } from "../components/BackButton";
import type { Stream } from "../../db/schema";

interface StreamScheduleForm {
  title: string;
  description: string;
  scheduledStartTime: string;
  thumbnailUrl: string;
}

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { data: streams, mutate } = useSWR<Stream[]>("/api/streams");
  const { toast } = useToast();
  
  const form = useForm<StreamScheduleForm>();

  const scheduledStreams = streams?.filter((s: Stream) => s.status === "scheduled") || [];
  
  const streamsOnSelectedDate = selectedDate
    ? scheduledStreams.filter((stream: Stream) => 
        format(new Date(stream.scheduledStartTime!), "yyyy-MM-dd") === 
        format(selectedDate, "yyyy-MM-dd")
      )
    : [];

  async function onSubmit(data: StreamScheduleForm) {
    try {
      await fetch("/api/streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          status: "scheduled",
          creatorId: "current-user-id", // In real app, get from auth
        }),
      });
      
      await mutate();
      toast({
        title: "Stream scheduled",
        description: "Your stream has been scheduled successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule stream. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="relative grid md:grid-cols-2 gap-6">
      <BackButton />
      <div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Schedule</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Schedule Stream</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule New Stream</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Stream Title"
                        {...form.register("title", { required: true })}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Description"
                        {...form.register("description")}
                      />
                    </div>
                    <div>
                      <Input
                        type="datetime-local"
                        {...form.register("scheduledStartTime", { required: true })}
                      />
                    </div>
                    <div>
                      <Input
                        placeholder="Thumbnail URL"
                        {...form.register("thumbnailUrl")}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Schedule Stream
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate
                ? `Streams on ${format(selectedDate, "MMMM d, yyyy")}`
                : "All Scheduled Streams"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(selectedDate ? streamsOnSelectedDate : scheduledStreams).map((stream: Stream) => (
                <Card key={stream.id}>
                  <CardContent className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{stream.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(stream.scheduledStartTime!), "h:mm a")}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(selectedDate ? streamsOnSelectedDate : scheduledStreams).length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No streams scheduled
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
