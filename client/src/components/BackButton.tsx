import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "./ui/button";

export function BackButton() {
  const [, setLocation] = useLocation();

  return (
    <Button
      variant="ghost"
      size="lg"
      className="absolute left-2 top-2 md:left-4 md:top-4 h-11 w-11 rounded-full hover:bg-accent active:scale-95 transition-transform"
      onClick={() => window.history.back()}
    >
      <ArrowLeft className="h-6 w-6" />
      <span className="sr-only">Go back</span>
    </Button>
  );
}
