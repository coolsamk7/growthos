import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/theme/ThemeProvider';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
        >
            {theme === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
