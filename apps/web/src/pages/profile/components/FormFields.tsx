import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputFieldProps {
    icon: React.ElementType;
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: ( value: string ) => void;
    disabled: boolean;
}

export function InputField( {
    icon: Icon,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    disabled
}: InputFieldProps ) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type={type}
                    value={value}
                    onChange={( e ) => onChange( e.target.value )}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="pl-10"
                />
            </div>
        </div>
    );
}

interface SelectFieldProps {
    icon: React.ElementType;
    label: string;
    options: string[];
    value: string;
    onChange: ( value: string ) => void;
    disabled: boolean;
}

export function SelectField( {
    icon: Icon,
    label,
    options,
    value,
    onChange,
    disabled
}: SelectFieldProps ) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                    value={value}
                    onChange={( e ) => onChange( e.target.value )}
                    disabled={disabled}
                    className="h-10 w-full appearance-none rounded-lg border border-input bg-background pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {options.map( ( option ) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ) )}
                </select>
            </div>
        </div>
    );
}
