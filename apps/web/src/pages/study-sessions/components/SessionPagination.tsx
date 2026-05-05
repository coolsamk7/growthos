import { Button } from '@/components/ui/button';

interface SessionPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: ( page: number ) => void;
}

export function SessionPagination( {
    page,
    totalPages,
    onPageChange
}: SessionPaginationProps ) {
    if ( totalPages <= 1 ) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-4 mt-6">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange( Math.max( 1, page - 1 ) )}
                disabled={page === 1}
            >
                Previous
            </Button>
            <span className="py-2 px-4 text-sm">
                Page {page} of {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange( Math.min( totalPages, page + 1 ) )}
                disabled={page === totalPages}
            >
                Next
            </Button>
        </div>
    );
}
