import { Home, Search, Library, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/search" },
    { icon: Library, label: "Library", href: "/library" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  const isActive = (href: string) => location === href;

  return (
    <nav className="lg:hidden fixed bottom-20 left-0 right-0 bg-spotify-gray border-t border-spotify-light-gray z-10">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a
              className={cn(
                "flex flex-col items-center py-2 px-3 transition-colors",
                isActive(item.href) ? "text-white" : "text-spotify-text"
              )}
            >
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
