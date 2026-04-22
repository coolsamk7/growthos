import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, MapPin } from 'lucide-react';

interface ProfileHeaderProps {
    firstName: string;
    lastName: string;
    occupation: string;
    company: string;
    city: string;
    country: string;
    experience: string;
    learningGoal: string;
}

export function ProfileHeader( { 
    firstName, 
    lastName, 
    occupation, 
    company, 
    city, 
    country, 
    experience, 
    learningGoal 
}: ProfileHeaderProps ) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    {/* Avatar */}
                    <div className="relative">
                        <Avatar className="size-24 border-4 border-background shadow-lg">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                                {firstName?.[0]}{lastName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105">
                            <Camera className="size-4" />
                        </button>
                    </div>

                    {/* Basic Info */}
                    <div className="flex flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-left">
                        <h2 className="text-xl font-bold text-foreground">
                            {firstName} {lastName}
                        </h2>
                        <p className="text-muted-foreground">
                            {occupation} {company && `at ${company}`}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                            {city && country && (
                                <Badge variant="secondary">
                                    <MapPin className="mr-1 size-3" />
                                    {city}, {country}
                                </Badge>
                            )}
                            {experience && <Badge variant="outline">{experience}</Badge>}
                            {learningGoal && <Badge>{learningGoal}</Badge>}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex gap-6 text-center">
                        <div>
                            <p className="text-2xl font-bold text-foreground">42</p>
                            <p className="text-xs text-muted-foreground">Completed</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">7</p>
                            <p className="text-xs text-muted-foreground">Day Streak</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">3</p>
                            <p className="text-xs text-muted-foreground">Paths</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
