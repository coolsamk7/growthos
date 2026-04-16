import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/app/dashboard" },
  { icon: BookOpen, label: "Learning Paths", href: "/app/learning-paths" },
  { icon: BarChart3, label: "Progress", href: "/app/progress" },
  { icon: Target, label: "Goals", href: "/app/goals" },
  { icon: Settings, label: "Settings", href: "/app/settings" },
];

export function Sidebar( { collapsed, onToggle }: SidebarProps ) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4">
        <Logo collapsed={collapsed} />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          className={cn(
            "text-muted-foreground hover:text-foreground",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map( ( item ) => {
            const isActive =
              location.pathname === item.href ||
              ( item.href === "/app/dashboard" &&
                location.pathname === "/app" );

            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className="size-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          } )}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4">
        <Separator className="mb-4" />
        {!collapsed && (
          <div className="rounded-xl bg-sidebar-accent p-4">
            <p className="text-xs font-medium text-sidebar-accent-foreground">
              Pro Tip
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Track your daily study hours to maintain consistency.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
