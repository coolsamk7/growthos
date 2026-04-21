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
    Edit2,
    X,
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

// Move these components outside to prevent re-creation
const InputField = ( {
    icon: Icon,
    label,
    field,
    type = 'text',
    placeholder,
    section,
    value,
    onChange,
    disabled
}: {
    icon: React.ElementType;
    label: string;
    field: string;
    type?: string;
    placeholder?: string;
    section: string;
    value: string;
    onChange: ( value: string ) => void;
    disabled: boolean;
} ) => (
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

const SelectField = ( {
    icon: Icon,
    label,
    field,
    options,
    section,
    value,
    onChange,
    disabled
}: {
    icon: React.ElementType;
    label: string;
    field: string;
    options: string[];
    section: string;
    value: string;
    onChange: ( value: string ) => void;
    disabled: boolean;
} ) => (
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

export function ProfilePage() {
    const [ editingSections, setEditingSections ] = useState<Record<string, boolean>>( {} );
    const [ savingSections, setSavingSections ] = useState<Record<string, boolean>>( {} );
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

    const toggleEdit = ( section: string ) => {
        setEditingSections( ( prev ) => ( { ...prev, [section]: !prev[section] } ) );
    };

    const handleSaveSection = async ( section: string ) => {
        setSavingSections( ( prev ) => ( { ...prev, [section]: true } ) );
        
        // TODO: Call API to save profile data
        // await updateProfile(profile);
        
        // Simulate API call
        await new Promise( ( resolve ) => setTimeout( resolve, 1000 ) );
        
        setSavingSections( ( prev ) => ( { ...prev, [section]: false } ) );
        setEditingSections( ( prev ) => ( { ...prev, [section]: false } ) );
        setShowSuccess( true );
        setTimeout( () => setShowSuccess( false ), 3000 );
    };

    const handleCancelSection = ( section: string ) => {
        setEditingSections( ( prev ) => ( { ...prev, [section]: false } ) );
        // TODO: Optionally reset to original values
    };

    const SectionHeader = ( { section, title, icon: Icon }: { section: string; title: string; icon: React.ElementType } ) => (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center gap-2">
                <Icon className="size-5 text-primary" />
                {title}
            </CardTitle>
            <div className="flex gap-2">
                {editingSections[section] ? (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelSection( section )}
                            disabled={savingSections[section]}
                        >
                            <X className="size-4" />
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => handleSaveSection( section )}
                            disabled={savingSections[section]}
                        >
                            {savingSections[section] ? (
                                <>
                                    <div className="mr-2 size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    Saving
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 size-4" />
                                    Save
                                </>
                            )}
                        </Button>
                    </>
                ) : (
                    <Button variant="ghost" size="sm" onClick={() => toggleEdit( section )}>
                        <Edit2 className="size-4" />
                    </Button>
                )}
            </div>
        </CardHeader>
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
                    <p className="mt-1 text-muted-foreground">Manage your personal information and preferences.</p>
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
                            <button className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105">
                                <Camera className="size-4" />
                            </button>
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
                    <SectionHeader section="personal" title="Personal Information" icon={User} />
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <InputField 
                                icon={User} 
                                label="First Name" 
                                field="firstName" 
                                placeholder="John" 
                                section="personal"
                                value={profile.firstName}
                                onChange={( value ) => handleChange( 'firstName', value )}
                                disabled={!editingSections['personal']}
                            />
                            <InputField 
                                icon={User} 
                                label="Last Name" 
                                field="lastName" 
                                placeholder="Doe" 
                                section="personal"
                                value={profile.lastName}
                                onChange={( value ) => handleChange( 'lastName', value )}
                                disabled={!editingSections['personal']}
                            />
                        </div>
                        <InputField
                            icon={Mail}
                            label="Email Address"
                            field="email"
                            type="email"
                            placeholder="john@example.com"
                            section="personal"
                            value={profile.email}
                            onChange={( value ) => handleChange( 'email', value )}
                            disabled={!editingSections['personal']}
                        />
                        <InputField
                            icon={Phone}
                            label="Phone Number"
                            field="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            section="personal"
                            value={profile.phone}
                            onChange={( value ) => handleChange( 'phone', value )}
                            disabled={!editingSections['personal']}
                        />
                        <InputField 
                            icon={Calendar} 
                            label="Date of Birth" 
                            field="dateOfBirth" 
                            type="date" 
                            section="personal"
                            value={profile.dateOfBirth}
                            onChange={( value ) => handleChange( 'dateOfBirth', value )}
                            disabled={!editingSections['personal']}
                        />
                    </CardContent>
                </Card>

                {/* Location */}
                <Card>
                    <SectionHeader section="location" title="Location" icon={MapPin} />
                    <CardContent className="flex flex-col gap-4">
                        <InputField 
                            icon={MapPin} 
                            label="City" 
                            field="city" 
                            placeholder="San Francisco" 
                            section="location"
                            value={profile.city}
                            onChange={( value ) => handleChange( 'city', value )}
                            disabled={!editingSections['location']}
                        />
                        <InputField 
                            icon={MapPin} 
                            label="State / Province" 
                            field="state" 
                            placeholder="California" 
                            section="location"
                            value={profile.state}
                            onChange={( value ) => handleChange( 'state', value )}
                            disabled={!editingSections['location']}
                        />
                        <InputField 
                            icon={Globe} 
                            label="Country" 
                            field="country" 
                            placeholder="United States" 
                            section="location"
                            value={profile.country}
                            onChange={( value ) => handleChange( 'country', value )}
                            disabled={!editingSections['location']}
                        />
                    </CardContent>
                </Card>

                {/* Professional Information */}
                <Card>
                    <SectionHeader section="professional" title="Professional Information" icon={Briefcase} />
                    <CardContent className="flex flex-col gap-4">
                        <InputField
                            icon={Briefcase}
                            label="Occupation / Role"
                            field="occupation"
                            placeholder="Software Engineer"
                            section="professional"
                            value={profile.occupation}
                            onChange={( value ) => handleChange( 'occupation', value )}
                            disabled={!editingSections['professional']}
                        />
                        <InputField
                            icon={Briefcase}
                            label="Company / Organization"
                            field="company"
                            placeholder="Tech Corp"
                            section="professional"
                            value={profile.company}
                            onChange={( value ) => handleChange( 'company', value )}
                            disabled={!editingSections['professional']}
                        />
                        <SelectField
                            icon={Briefcase}
                            label="Years of Experience"
                            field="experience"
                            options={experienceOptions}
                            section="professional"
                            value={profile.experience}
                            onChange={( value ) => handleChange( 'experience', value )}
                            disabled={!editingSections['professional']}
                        />
                    </CardContent>
                </Card>

                {/* Education */}
                <Card>
                    <SectionHeader section="education" title="Education" icon={GraduationCap} />
                    <CardContent className="flex flex-col gap-4">
                        <SelectField
                            icon={GraduationCap}
                            label="Highest Education"
                            field="highestEducation"
                            options={educationOptions}
                            section="education"
                            value={profile.highestEducation}
                            onChange={( value ) => handleChange( 'highestEducation', value )}
                            disabled={!editingSections['education']}
                        />
                        <InputField
                            icon={GraduationCap}
                            label="Field of Study"
                            field="fieldOfStudy"
                            placeholder="Computer Science"
                            section="education"
                            value={profile.fieldOfStudy}
                            onChange={( value ) => handleChange( 'fieldOfStudy', value )}
                            disabled={!editingSections['education']}
                        />
                        <InputField
                            icon={GraduationCap}
                            label="Institution"
                            field="institution"
                            placeholder="Stanford University"
                            section="education"
                            value={profile.institution}
                            onChange={( value ) => handleChange( 'institution', value )}
                            disabled={!editingSections['education']}
                        />
                        <InputField 
                            icon={Calendar} 
                            label="Graduation Year" 
                            field="graduationYear" 
                            placeholder="2017" 
                            section="education"
                            value={profile.graduationYear}
                            onChange={( value ) => handleChange( 'graduationYear', value )}
                            disabled={!editingSections['education']}
                        />
                    </CardContent>
                </Card>

                {/* Learning Goals */}
                <Card>
                    <SectionHeader section="goals" title="Learning Goals" icon={GraduationCap} />
                    <CardContent className="flex flex-col gap-4">
                        <SelectField
                            icon={GraduationCap}
                            label="Primary Learning Goal"
                            field="learningGoal"
                            options={learningGoalOptions}
                            section="goals"
                            value={profile.learningGoal}
                            onChange={( value ) => handleChange( 'learningGoal', value )}
                            disabled={!editingSections['goals']}
                        />
                        <InputField
                            icon={GraduationCap}
                            label="Target Exam / Certification"
                            field="targetExam"
                            placeholder="AWS Solutions Architect"
                            section="goals"
                            value={profile.targetExam}
                            onChange={( value ) => handleChange( 'targetExam', value )}
                            disabled={!editingSections['goals']}
                        />
                        <Separator className="my-2" />
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-foreground">Bio</label>
                            <textarea
                                value={profile.bio}
                                onChange={( e ) => handleChange( 'bio', e.target.value )}
                                disabled={!editingSections['goals']}
                                placeholder="Tell us about yourself..."
                                rows={4}
                                className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card>
                    <SectionHeader section="social" title="Social Links" icon={Globe} />
                    <CardContent className="flex flex-col gap-4">
                        <InputField
                            icon={Linkedin}
                            label="LinkedIn"
                            field="linkedinUrl"
                            placeholder="https://linkedin.com/in/username"
                            section="social"
                            value={profile.linkedinUrl}
                            onChange={( value ) => handleChange( 'linkedinUrl', value )}
                            disabled={!editingSections['social']}
                        />
                        <InputField
                            icon={Github}
                            label="GitHub"
                            field="githubUrl"
                            placeholder="https://github.com/username"
                            section="social"
                            value={profile.githubUrl}
                            onChange={( value ) => handleChange( 'githubUrl', value )}
                            disabled={!editingSections['social']}
                        />
                        <InputField
                            icon={Twitter}
                            label="Twitter"
                            field="twitterUrl"
                            placeholder="https://twitter.com/username"
                            section="social"
                            value={profile.twitterUrl}
                            onChange={( value ) => handleChange( 'twitterUrl', value )}
                            disabled={!editingSections['social']}
                        />
                        <InputField
                            icon={Globe}
                            label="Personal Website"
                            field="websiteUrl"
                            placeholder="https://yourwebsite.com"
                            section="social"
                            value={profile.websiteUrl}
                            onChange={( value ) => handleChange( 'websiteUrl', value )}
                            disabled={!editingSections['social']}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
