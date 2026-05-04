import * as React from "react"
import { format, parseISO, isValid, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange?: ( value: string ) => void
  disabled?: boolean
  placeholder?: string
  disablePast?: boolean
  disableFuture?: boolean
}

export function DatePicker( { value, onChange, disabled, placeholder = "Pick a date", disablePast = false, disableFuture = false }: DatePickerProps ) {
  const [ open, setOpen ] = React.useState( false )

  // Get today's date at midnight for comparison
  const today = React.useMemo( () => {
    const now = new Date()
    return new Date( now.getFullYear(), now.getMonth(), now.getDate() )
  }, [] )

  // Get tomorrow's date for future comparison
  const tomorrow = React.useMemo( () => {
    const now = new Date()
    return new Date( now.getFullYear(), now.getMonth(), now.getDate() + 1 )
  }, [] )

  // Parse the value prop into a Date object
  const selectedDate = React.useMemo( () => {
    console.log( 'Parsing value:', value )
    if ( !value || value === '' ) {
      console.log( 'No value, returning undefined' )
      return undefined
    }
    
    try {
      // Try parsing as ISO date (YYYY-MM-DD)
      const parsed = parseISO( value )
      console.log( 'Parsed date:', parsed, 'Valid:', isValid( parsed ) )
      
      if ( isValid( parsed ) ) {
        // Create a new date at midnight UTC to avoid timezone issues
        const normalized = new Date( Date.UTC(
          parsed.getFullYear(),
          parsed.getMonth(),
          parsed.getDate()
        ) )
        console.log( 'Normalized date:', normalized )
        return normalized
      }
      return undefined
    } catch ( e ) {
      console.error( 'Error parsing date:', e )
      return undefined
    }
  }, [ value ] )

  const handleSelect = ( date: any ) => {
    console.log( 'Date selected:', date )
    if ( date && onChange ) {
      const formatted = format( date, "yyyy-MM-dd" )
      console.log( 'Formatted as:', formatted )
      onChange( formatted )
      setOpen( false )
    }
  }


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format( selectedDate, "PPP" ) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-2 border-b text-xs bg-muted/30">
          Selected: {selectedDate ? format( selectedDate, "yyyy-MM-dd" ) : 'None'}
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onDayFocus={handleSelect}
          defaultMonth={selectedDate}
          captionLayout="dropdown-buttons"
          fromYear={disablePast ? new Date().getFullYear() : 1900}
          toYear={disableFuture ? new Date().getUTCFullYear() : new Date().getUTCFullYear() + 10}
          disabled={
            disablePast 
              ? ( date: Date ) => date < today 
              : disableFuture 
                ? ( date: Date ) => date >= tomorrow 
                : undefined
          }
        />
      </PopoverContent>
    </Popover>
  )
}
