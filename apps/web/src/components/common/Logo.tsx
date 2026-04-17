import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';

interface LogoProps {
    collapsed?: boolean;
}

export function Logo( { collapsed = false }: LogoProps ) {
    return (
        <Link to="/" className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary">
                <TrendingUp className="size-5 text-primary-foreground" />
            </div>
            {!collapsed && <span className="text-lg font-bold text-foreground">GrowthOS</span>}
        </Link>
    );
}
