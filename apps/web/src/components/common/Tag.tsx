import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagProps {
    name: string;
    color?: string;
    removable?: boolean;
    onRemove?: () => void;
    className?: string;
}

export function Tag( { name, color, removable, onRemove, className }: TagProps ) {
    const style = color ? { backgroundColor: `${color}20`, color: color, borderColor: color } : {};

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium border',
                !color && 'bg-secondary text-secondary-foreground border-secondary',
                className
            )}
            style={style}
        >
            {name}
            {removable && onRemove && (
                <button
                    type="button"
                    onClick={( e ) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="ml-0.5 hover:opacity-70 transition-opacity"
                >
                    <X className="h-3 w-3" />
                </button>
            )}
        </span>
    );
}
