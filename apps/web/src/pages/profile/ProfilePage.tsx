import { useState } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    GraduationCap,
    Calendar,
    Globe,
    Linkedin,
    Github,
    Twitter,
    Camera,
    Save,
    CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileData {
    // Personal Information
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;

    // Location
    city: string;
    state: string;
    country: string;

    // Professional
    occupation: string;
    company: string;
    experience: string;

    // Education
    highestEducation: string;
    fieldOfStudy: string;
    institution: string;
    graduationYear: string;

    // Goals
    learningGoal: string;
    targetExam: string;

    // Social
    linkedinUrl: string;
    githubUrl: string;
    twitterUrl: string;
    websiteUrl: string;

    // Bio
    bio: string;
}

const educationOptions = [ 'High School', 'Diploma', "Bachelor's Degree", "Master's Degree", 'PhD', 'Other' ];

const experienceOptions = [ 'Student', '0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years' ];

const learningGoalOptions = [
    'Career Switch',
    'Skill Enhancement',
    'Competitive Exams',
    'Personal Growth',
    'Academic Excellence',
    'Certification',
];

export function ProfilePage() {
    const [ isEditing, setIsEditing ] = useState( false );
    const [ isSaving, setIsSaving ] = useState( false );
    const [ showSuccess, setShowSuccess ] = useState( false );

    const [ profile, setProfile ] = useState<ProfileData>( {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1995-06-15',
        city: 'San Francisco',
        state: 'California',
        country: 'United States',
        occupation: 'Software Engineer',
        company: 'Tech Corp',
        experience: '3-5 years',
        highestEducation: "Bachelor's Degree",
        fieldOfStudy: 'Computer Science',
        institution: 'Stanford University',
        graduationYear: '2017',
        learningGoal: 'Skill Enhancement',
        targetExam: 'AWS Solutions Architect',
        linkedinUrl: 'https://linkedin.com/in/johndoe',
        githubUrl: 'https://github.com/johndoe',
        twitterUrl: '',
        websiteUrl: '',
        bio: 'Passionate software engineer with a love for learning new technologies and building innovative solutions.',
    } );

    const handleChange = ( field: keyof ProfileData, value: string ) => {
        setProfile( ( prev ) => ( { ...prev, [field]: value } ) );
    };

    const handleSave = async () => {
        setIsSaving( true );
        // Simulate API call
        await new Promise( ( resolve ) => setTimeout( resolve, 1000 ) );
        setIsSaving( false );
        setIsEditing( false );
        setShowSuccess( true );
        setTimeout( () => setShowSuccess( false ), 3000 );
    };

    const InputField = ( {
        icon: Icon,
        label,
        field,
        type = 'text',
        placeholder,
    }: {
        icon: React.ElementType;
        label: string;
        field: keyof ProfileData;
        type?: string;
        placeholder?: string;
    } ) => (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type={type}
                    value={profile[field]}
                    onChange={( e ) => handleChange( field, e.target.value )}
                    disabled={!isEditing}
                    placeholder={placeholder}
                    className="pl-10"
                />
            </div>
        </div>
    );

    const SelectField = ( {
        icon: Icon,
        label,
        field,
        options,
    }: {
        icon: React.ElementType;
        label: string;
        field: keyof ProfileData;
        options: string[];
    } ) => (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">{label}</label>
            <div className="relative">
                <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                    value={profile[field]}
                    onChange={( e ) => handleChange( field, e.target.value )}
                    disabled={!isEditing}
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

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                    <p className="mt-1 text-muted-foreground">Manage your personal information and preferences.</p>
                </div>
                <div className="flex gap-3">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing( false )}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <div className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 size-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing( true )}>Edit Profile</Button>
                    )}
                </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="flex items-center gap-3 rounded-xl border border-success/20 bg-success/10 p-4">
                    <CheckCircle2 className="size-5 text-success" />
                    <p className="text-sm font-medium text-success">Profile updated successfully!</p>
                </div>
            )}

            {/* Profile Header Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                        {/* Avatar */}
                        <div className="relative">
                            <Avatar className="size-24 border-4 border-background shadow-lg">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                                    {profile.firstName[0]}
                                    {profile.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            {isEditing && (
                                <button className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105">
                                    <Camera className="size-4" />
                                </button>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="flex flex-1 flex-col items-center gap-2 text-center sm:items-start sm:text-left">
                            <h2 className="text-xl font-bold text-foreground">
                                {profile.firstName} {profile.lastName}
                            </h2>
                            <p className="text-muted-foreground">
                                {profile.occupation} at {profile.company}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="secondary">
                                    <MapPin className="mr-1 size-3" />
                                    {profile.city}, {profile.country}
                                </Badge>
                                <Badge variant="outline">{profile.experience}</Badge>
                                <Badge>{profile.learningGoal}</Badge>
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

            {/* Form Sections */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="size-5 text-primary" />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InputField icon={User} label="First Name" field="firstName" placeholder="John" />
                            <InputField icon={User} label="Last Name" field="lastName" placeholder="Doe" />
                        </div>
                        <InputField
                            icon={Mail}
                            label="Email Address"
                            field="email"
                            type="email"
                            placeholder="john@example.com"
                        />
                        <InputField
                            icon={Phone}
                            label="Phone Number"
                            field="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                        />
                        <InputField icon={Calendar} label="Date of Birth" field="dateOfBirth" type="date" />
                    </CardContent>
                </Card>

                {/* Location */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="size-5 text-primary" />
                            Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <InputField icon={MapPin} label="City" field="city" placeholder="San Francisco" />
                        <InputField icon={MapPin} label="State / Province" field="state" placeholder="California" />
                        <InputField icon={Globe} label="Country" field="country" placeholder="United States" />
                    </CardContent>
                </Card>

                {/* Professional Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="size-5 text-primary" />
                            Professional Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <InputField
                            icon={Briefcase}
                            label="Occupation / Role"
                            field="occupation"
                            placeholder="Software Engineer"
                        />
                        <InputField
                            icon={Briefcase}
                            label="Company / Organization"
                            field="company"
                            placeholder="Tech Corp"
                        />
                        <SelectField
                            icon={Briefcase}
                            label="Years of Experience"
                            field="experience"
                            options={experienceOptions}
                        />
                    </CardContent>
                </Card>

                {/* Education */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="size-5 text-primary" />
                            Education
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <SelectField
                            icon={GraduationCap}
                            label="Highest Education"
                            field="highestEducation"
                            options={educationOptions}
                        />
                        <InputField
                            icon={GraduationCap}
                            label="Field of Study"
                            field="fieldOfStudy"
                            placeholder="Computer Science"
                        />
                        <InputField
                            icon={GraduationCap}
                            label="Institution"
                            field="institution"
                            placeholder="Stanford University"
                        />
                        <InputField icon={Calendar} label="Graduation Year" field="graduationYear" placeholder="2017" />
                    </CardContent>
                </Card>

                {/* Learning Goals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="size-5 text-primary" />
                            Learning Goals
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <SelectField
                            icon={GraduationCap}
                            label="Primary Learning Goal"
                            field="learningGoal"
                            options={learningGoalOptions}
                        />
                        <InputField
                            icon={GraduationCap}
                            label="Target Exam / Certification"
                            field="targetExam"
                            placeholder="AWS Solutions Architect"
                        />
                        <Separator className="my-2" />
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-foreground">Bio</label>
                            <textarea
                                value={profile.bio}
                                onChange={( e ) => handleChange( 'bio', e.target.value )}
                                disabled={!isEditing}
                                placeholder="Tell us about yourself..."
                                rows={4}
                                className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="size-5 text-primary" />
                            Social Links
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <InputField
                            icon={Linkedin}
                            label="LinkedIn"
                            field="linkedinUrl"
                            placeholder="https://linkedin.com/in/username"
                        />
                        <InputField
                            icon={Github}
                            label="GitHub"
                            field="githubUrl"
                            placeholder="https://github.com/username"
                        />
                        <InputField
                            icon={Twitter}
                            label="Twitter"
                            field="twitterUrl"
                            placeholder="https://twitter.com/username"
                        />
                        <InputField
                            icon={Globe}
                            label="Personal Website"
                            field="websiteUrl"
                            placeholder="https://yourwebsite.com"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
