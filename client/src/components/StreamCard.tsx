import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StreamCardProps {
  stream: {
    id: number;
    title: string;
    creatorId: number;
    thumbnailUrl: string;
    status: string;
    viewerCount: number;
    createdAt: string;
    creator?: {
      displayName: string;
      avatarUrl: string;
    };
  };
}

export function StreamCard({ stream }: StreamCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow active:scale-[0.98] touch-manipulation">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <img
            src={stream.thumbnailUrl || "/placeholder-stream.jpg"}
            alt={stream.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {stream.status === "live" && (
            <Badge 
              variant="destructive" 
              className="absolute top-2 left-2 px-2 py-1"
            >
              LIVE
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
            <AvatarImage src={stream.creator?.avatarUrl} />
            <AvatarFallback>
              {stream.creator?.displayName?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <CardTitle className="text-base sm:text-lg font-semibold leading-tight mb-1 truncate">
              {stream.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground truncate">
              {stream.creator?.displayName}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-3 pb-3 sm:px-4 sm:pb-4 pt-0 flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          {stream.viewerCount}
        </div>
        <span>
          {formatDistanceToNow(new Date(stream.createdAt), { addSuffix: true })}
        </span>
      </CardFooter>
    </Card>
  );
}
