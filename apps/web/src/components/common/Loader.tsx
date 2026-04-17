import { cn } from '@/lib/utils';

interface LoaderProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function Loader( { className, size = 'md' }: LoaderProps ) {
    const sizeClasses = {
        sm: 'size-4 border-2',
        md: 'size-6 border-2',
        lg: 'size-8 border-3',
    };

    return (
        <div
            className={cn( 'animate-spin rounded-full border-primary/30 border-t-primary', sizeClasses[size], className )}
        />
    );
}
