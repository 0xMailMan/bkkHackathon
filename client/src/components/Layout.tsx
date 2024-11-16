import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { NavigationMenu } from "./ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { UserCircle, Video, Calendar, Compass, Menu } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const [logoError, setLogoError] = useState(false);

  const navItems = [
    { href: "/explore", icon: Compass, label: "Explore" },
    { href: "/schedule", icon: Calendar, label: "Schedule" },
    { href: "/profile/me", icon: UserCircle, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-2 sm:px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Button 
              variant="link" 
              className="p-0 min-h-[44px]"
            >
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  alt="NEXTHype"
                  className="h-8 md:h-10 w-auto"
                  onError={(e) => {
                    setLogoError(true);
                    console.error('Failed to load logo:', e);
                  }}
                />
              ) : (
                <span className="text-xl font-bold">
                  NEXT<span className="text-primary">Hype</span>
                </span>
              )}
            </Button>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  className={`h-11 px-4 ${location === href ? "bg-accent" : ""} hover:bg-accent/80 active:scale-95 transition-transform`}
                >
                  <Icon className="mr-2 h-5 w-5" />
                  {label}
                </Button>
              </Link>
            ))}
            <Button 
              className="h-11 px-4 active:scale-95 transition-transform"
            >
              <Video className="mr-2 h-5 w-5" />
              Go Live
            </Button>
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button 
                variant="ghost" 
                size="lg"
                className="h-11 w-11 active:scale-95 transition-transform"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[385px] p-0">
              <nav className="flex flex-col h-full py-6">
                <div className="px-4 mb-6">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="link" 
                      className="p-0 min-h-[44px]"
                    >
                      {!logoError ? (
                        <img 
                          src="/logo.png" 
                          alt="NEXTHype"
                          className="h-8 md:h-10 w-auto"
                          onError={(e) => {
                            setLogoError(true);
                            console.error('Failed to load logo:', e);
                          }}
                        />
                      ) : (
                        <span className="text-xl font-bold">
                          NEXT<span className="text-primary">Hype</span>
                        </span>
                      )}
                    </Button>
                  </Link>
                </div>
                <div className="flex-1 px-3 space-y-2">
                  {navItems.map(({ href, icon: Icon, label }) => (
                    <Link key={href} href={href} onClick={() => setIsOpen(false)}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start h-12 ${
                          location === href ? "bg-accent" : ""
                        } hover:bg-accent/80 active:scale-95 transition-transform`}
                      >
                        <Icon className="mr-3 h-5 w-5" />
                        {label}
                      </Button>
                    </Link>
                  ))}
                  <Button 
                    className="w-full justify-start h-12 mt-4 active:scale-95 transition-transform"
                  >
                    <Video className="mr-3 h-5 w-5" />
                    Go Live
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
}
