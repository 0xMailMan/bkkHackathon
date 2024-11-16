import { useState } from "react";
import useSWR from "swr";
import { StreamCard } from "../components/StreamCard";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, Filter } from "lucide-react";
import { BackButton } from "../components/BackButton";

export default function Explore() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const { data: streams } = useSWR("/api/streams");
  const { data: creators } = useSWR("/api/users?isCreator=true");

  const filteredStreams = streams?.filter(stream => {
    const matchesSearch = stream.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || stream.status === filter;
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div className="relative space-y-8">
      <BackButton />
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search streams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Streams</SelectItem>
            <SelectItem value="live">Live Now</SelectItem>
            <SelectItem value="scheduled">Upcoming</SelectItem>
            <SelectItem value="ended">Past Streams</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {creators && creators.length > 0 && (
        <section className="py-4">
          <h2 className="text-lg font-semibold mb-4">Featured Creators</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {creators.map(creator => (
              <Card key={creator.id} className="min-w-[200px]">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {creator.displayName?.[0] || creator.username[0]}
                    </div>
                    <div>
                      <p className="font-medium">{creator.displayName || creator.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {creator.followerCount || 0} followers
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-3">
                    Follow
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredStreams.map(stream => (
          <StreamCard key={stream.id} stream={stream} />
        ))}
        
        {filteredStreams.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No streams found matching your criteria
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
