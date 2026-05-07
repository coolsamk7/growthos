import { useState } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SearchFilters } from '@/services/study-session.service';

interface SessionSearchProps {
    filters: SearchFilters;
    onFiltersChange: ( filters: SearchFilters ) => void;
    onSearch: () => void;
    moduleNames?: Record<string, string>;
    topicNames?: Record<string, string>;
}

export function SessionSearch( { 
    filters, 
    onFiltersChange, 
    onSearch,
    moduleNames = {},
    topicNames = {}
}: SessionSearchProps ) {
    const [ showAdvanced, setShowAdvanced ] = useState( false );

    const handleQueryChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        onFiltersChange( { ...filters, q: e.target.value } );
    };

    const handleClearFilter = ( key: keyof SearchFilters ) => {
        const newFilters = { ...filters };
        delete newFilters[key];
        onFiltersChange( newFilters );
        onSearch();
    };

    const handleClearAll = () => {
        onFiltersChange( {} );
        onSearch();
    };

    const activeFiltersCount = Object.keys( filters ).filter( 
        k => k !== 'page' && k !== 'limit' && filters[k as keyof SearchFilters] 
    ).length;

    return (
        <div className="space-y-3">
            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search in notes..."
                        value={filters.q || ''}
                        onChange={handleQueryChange}
                        onKeyDown={( e ) => e.key === 'Enter' && onSearch()}
                        className="pl-10"
                    />
                    {filters.q && (
                        <button
                            onClick={() => handleClearFilter( 'q' )}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
                <Button onClick={onSearch}>
                    Search
                </Button>
                <Button
                    variant={showAdvanced ? 'default' : 'outline'}
                    onClick={() => setShowAdvanced( !showAdvanced )}
                >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                            {activeFiltersCount}
                        </Badge>
                    )}
                </Button>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        {/* Date Range */}
                        <div>
                            <label className="text-sm font-medium mb-1 block">Start Date</label>
                            <Input
                                type="date"
                                value={filters.startDate || ''}
                                onChange={( e ) => onFiltersChange( { ...filters, startDate: e.target.value } )}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">End Date</label>
                            <Input
                                type="date"
                                value={filters.endDate || ''}
                                onChange={( e ) => onFiltersChange( { ...filters, endDate: e.target.value } )}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={handleClearAll}>
                            Clear All
                        </Button>
                        <Button size="sm" onClick={onSearch}>
                            Apply Filters
                        </Button>
                    </div>
                </div>
            )}

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                    {filters.q && (
                        <Badge variant="secondary" className="gap-1">
                            Search: "{filters.q}"
                            <button onClick={() => handleClearFilter( 'q' )}>
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.startDate && (
                        <Badge variant="secondary" className="gap-1">
                            From: {filters.startDate}
                            <button onClick={() => handleClearFilter( 'startDate' )}>
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.endDate && (
                        <Badge variant="secondary" className="gap-1">
                            To: {filters.endDate}
                            <button onClick={() => handleClearFilter( 'endDate' )}>
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.moduleId && (
                        <Badge variant="secondary" className="gap-1">
                            Module: {moduleNames[filters.moduleId] || filters.moduleId}
                            <button onClick={() => handleClearFilter( 'moduleId' )}>
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                    {filters.topicId && (
                        <Badge variant="secondary" className="gap-1">
                            Topic: {topicNames[filters.topicId] || filters.topicId}
                            <button onClick={() => handleClearFilter( 'topicId' )}>
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
