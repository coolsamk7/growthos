import { Search, Bell, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { logoutUser } from '@/services/auth.service';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Navbar() {
    const navigate = useNavigate();

    const handleSignOut = () => {
        logoutUser();
        navigate( '/signIn' );
    };

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            {/* Search */}
            <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search learning paths, modules..." className="pl-9" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <ThemeToggle />

                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                    <Bell className="size-5" />
                    <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
                    <span className="sr-only">Notifications</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="relative ml-2 flex size-9 cursor-pointer items-center justify-center rounded-full outline-none ring-offset-background transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <Avatar className="size-9">
                                <AvatarImage
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=faces"
                                    alt="User"
                                />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm font-medium">John Doe</p>
                                <p className="text-xs text-muted-foreground">john@example.com</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate( '/app/profile' )} className="cursor-pointer">
                            <User className="mr-2 size-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate( '/app/settings' )} className="cursor-pointer">
                            <Settings className="mr-2 size-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            <HelpCircle className="mr-2 size-4" />
                            Help & Support
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleSignOut}
                            className="cursor-pointer text-destructive focus:text-destructive"
                        >
                            <LogOut className="mr-2 size-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
