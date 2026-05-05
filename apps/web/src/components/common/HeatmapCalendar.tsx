import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getHeatmapData, type HeatmapData } from '@/services/study-session.service';
import { toast } from 'sonner';

interface HeatmapCalendarProps {
    startDate?: Date;
    endDate?: Date;
}

export function HeatmapCalendar( { startDate, endDate }: HeatmapCalendarProps ) {
    const [ data, setData ] = useState<HeatmapData>( {} );
    const [ loading, setLoading ] = useState( true );

    useEffect( () => {
        loadHeatmapData();
    }, [ startDate, endDate ] );

    const loadHeatmapData = async () => {
        try {
            setLoading( true );
            const start = startDate?.toISOString().split( 'T' )[0];
            const end = endDate?.toISOString().split( 'T' )[0];
            const heatmapData = await getHeatmapData( start, end );
            setData( heatmapData );
        } catch ( error ) {
            console.error( 'Failed to load heatmap data:', error );
            toast.error( 'Failed to load activity data' );
        } finally {
            setLoading( false );
        }
    };

    const generateCalendarGrid = () => {
        const end = endDate || new Date();
        const start = startDate || new Date( end.getTime() - 365 * 24 * 60 * 60 * 1000 );
        
        // Start from the most recent Sunday
        const endSunday = new Date( end );
        endSunday.setDate( end.getDate() + ( 7 - end.getDay() ) % 7 );
        
        // Calculate weeks needed
        const weeks: Date[][] = [];
        const currentWeekStart = new Date( endSunday );
        currentWeekStart.setDate( currentWeekStart.getDate() - 364 ); // ~52 weeks
        
        // Find the Sunday before start
        currentWeekStart.setDate( currentWeekStart.getDate() - currentWeekStart.getDay() );
        
        while ( currentWeekStart <= endSunday ) {
            const week: Date[] = [];
            for ( let i = 0; i < 7; i++ ) {
                const day = new Date( currentWeekStart );
                day.setDate( day.getDate() + i );
                week.push( day );
            }
            weeks.push( week );
            currentWeekStart.setDate( currentWeekStart.getDate() + 7 );
        }
        
        return weeks;
    };

    const getIntensityClass = ( minutes: number ) => {
        if ( minutes === 0 ) return 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
        if ( minutes < 30 ) return 'bg-green-200 dark:bg-green-900/50';
        if ( minutes < 60 ) return 'bg-green-400 dark:bg-green-700/70';
        if ( minutes < 120 ) return 'bg-green-600 dark:bg-green-500';
        return 'bg-green-700 dark:bg-green-400';
    };

    const getTooltipText = ( date: Date, minutes: number ) => {
        const dateStr = date.toLocaleDateString( 'en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        } );
        
        if ( minutes === 0 ) return `${dateStr}\nNo study time`;
        
        const hours = Math.floor( minutes / 60 );
        const mins = minutes % 60;
        
        let timeStr = '';
        if ( hours > 0 ) timeStr += `${hours} hour${hours > 1 ? 's' : ''} `;
        if ( mins > 0 ) timeStr += `${mins} minute${mins > 1 ? 's' : ''}`;
        
        return `${dateStr}\n${timeStr.trim()} studied`;
    };

    const weeks = generateCalendarGrid();
    
    // Get month labels
    const monthLabels: Array<{ month: string; weekIndex: number }> = [];
    let lastMonth = '';
    weeks.forEach( ( week, weekIndex ) => {
        const firstDay = week[0];
        const month = firstDay.toLocaleDateString( 'en-US', { month: 'short' } );
        if ( month !== lastMonth && weekIndex > 0 ) {
            monthLabels.push( { month, weekIndex } );
            lastMonth = month;
        }
    } );

    if ( loading ) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Activity Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-2">
                        {[ ...Array( 10 ) ].map( ( _, i ) => (
                            <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                        ) )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Study Activity</span>
                    <span className="text-sm font-normal text-gray-500">
                        {weeks.length} weeks
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto pb-4">
                    <div className="inline-block min-w-full">
                        {/* Month labels */}
                        <div className="relative h-4 mb-2 ml-8">
                            {monthLabels.map( ( { month, weekIndex } ) => (
                                <span
                                    key={`${month}-${weekIndex}`}
                                    className="absolute text-xs text-gray-600 dark:text-gray-400"
                                    style={{ 
                                        left: `${weekIndex * 14}px`
                                    }}
                                >
                                    {month}
                                </span>
                            ) )}
                        </div>
                        
                        <div className="flex gap-[3px]">
                            {/* Day labels */}
                            <div className="flex flex-col gap-[3px] text-[10px] text-gray-600 dark:text-gray-400 pr-1 justify-start">
                                <div className="h-[11px] leading-[11px]">Mon</div>
                                <div className="h-[11px]"></div>
                                <div className="h-[11px] leading-[11px]">Wed</div>
                                <div className="h-[11px]"></div>
                                <div className="h-[11px] leading-[11px]">Fri</div>
                                <div className="h-[11px]"></div>
                                <div className="h-[11px] leading-[11px]">Sun</div>
                            </div>
                            
                            {/* Heatmap grid */}
                            <div className="flex gap-[3px]">
                                {weeks.map( ( week, weekIndex ) => (
                                    <div key={weekIndex} className="flex flex-col gap-[3px]">
                                        {week.map( ( day, dayIndex ) => {
                                            const dateKey = day.toISOString().split( 'T' )[0];
                                            const minutes = data[dateKey] || 0;
                                            const today = new Date();
                                            const isToday = day.toDateString() === today.toDateString();
                                            const isFuture = day > today;
                                            
                                            return (
                                                <div
                                                    key={`${weekIndex}-${dayIndex}`}
                                                    className={`w-[11px] h-[11px] rounded-sm ${
                                                        isFuture 
                                                            ? 'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800' 
                                                            : getIntensityClass( minutes )
                                                    } ${
                                                        isToday ? 'ring-2 ring-blue-500' : ''
                                                    } hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all`}
                                                    title={getTooltipText( day, minutes )}
                                                />
                                            );
                                        } )}
                                    </div>
                                ) )}
                            </div>
                        </div>
                        
                        {/* Legend */}
                        <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 dark:text-gray-400 ml-8">
                            <span>Less</span>
                            <div className="flex gap-1">
                                <div className="w-[11px] h-[11px] rounded-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
                                <div className="w-[11px] h-[11px] rounded-sm bg-green-200 dark:bg-green-900/50" />
                                <div className="w-[11px] h-[11px] rounded-sm bg-green-400 dark:bg-green-700/70" />
                                <div className="w-[11px] h-[11px] rounded-sm bg-green-600 dark:bg-green-500" />
                                <div className="w-[11px] h-[11px] rounded-sm bg-green-700 dark:bg-green-400" />
                            </div>
                            <span>More</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
