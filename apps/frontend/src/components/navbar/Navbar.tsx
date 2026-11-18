import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Code2, Menu } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Code2 className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight">CodeArena</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/problems"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Problems
          </Link>

          <Link
            to="/contests"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Contests
          </Link>

          <Link
            to="/practice"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Practice
          </Link>

          <Link
            to="/leaderboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Leaderboard
          </Link>
        </div>

        {/* Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link to="/login">Login</Link>
          </Button>

          <Button asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile Menu Icon */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </nav>
    </header>
  );
}

export default Navbar;
