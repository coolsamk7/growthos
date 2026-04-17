import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Route,
    LayoutTemplate,
    TrendingUp,
    Flame,
    Target,
    Building2,
    Server,
    GraduationCap,
    BookOpenCheck,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import { ThemeToggle } from '@/components/common/ThemeToggle';

const features = [
    {
        icon: Route,
        title: 'Custom Paths',
        description: 'Create personalized learning journeys tailored to your goals.',
    },
    {
        icon: LayoutTemplate,
        title: 'Templates',
        description: 'Start with pre-built paths for popular career tracks.',
    },
    {
        icon: TrendingUp,
        title: 'Progress Tracking',
        description: 'Visualize your growth with detailed analytics and insights.',
    },
    {
        icon: Flame,
        title: 'Streaks',
        description: 'Build consistency with daily streaks and habit tracking.',
    },
    {
        icon: Target,
        title: 'Goals',
        description: 'Set milestones and celebrate achievements along the way.',
    },
];

const howItWorks = [
    {
        step: '01',
        title: 'Choose Your Path',
        description: 'Select from templates or create a custom learning path.',
    },
    {
        step: '02',
        title: 'Add Resources',
        description: 'Curate courses, articles, and tutorials into modules.',
    },
    {
        step: '03',
        title: 'Track Progress',
        description: 'Log your study time and mark items as complete.',
    },
    {
        step: '04',
        title: 'Achieve Goals',
        description: 'Hit milestones and level up your skills consistently.',
    },
];

const useCases = [
    { icon: Building2, label: 'FAANG Prep', description: 'System design & DSA' },
    { icon: Server, label: 'DevOps', description: 'Cloud & infrastructure' },
    { icon: GraduationCap, label: 'UPSC', description: 'Civil services exam prep' },
    { icon: BookOpenCheck, label: 'Students', description: 'Academic excellence' },
];

export function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    <Logo />
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link to="/signIn">
                            <Button variant="ghost">Sign in</Button>
                        </Link>
                        <Link to="/app">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 md:py-32">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--primary)_0%,transparent_100%)] opacity-10" />
                <div className="mx-auto max-w-7xl px-4 text-center">
                    <div className="mx-auto max-w-3xl">
                        <h1 className="text-pretty text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                            Build Your Learning Path. <span className="text-primary">Track Your Growth.</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                            The all-in-one platform for structured learning and progress analytics. Create custom paths,
                            track your streaks, and achieve your learning goals.
                        </p>
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link to="/app">
                                <Button size="lg" className="gap-2">
                                    Start Learning Free
                                    <ArrowRight className="size-4" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline">
                                View Demo
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
                        {[
                            { value: '10K+', label: 'Active Learners' },
                            { value: '500+', label: 'Learning Paths' },
                            { value: '2M+', label: 'Hours Tracked' },
                            { value: '98%', label: 'Satisfaction' },
                        ].map( ( stat ) => (
                            <div key={stat.label}>
                                <p className="text-3xl font-bold text-foreground md:text-4xl">{stat.value}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                            </div>
                        ) )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-muted/50 py-24">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                            Everything You Need to Learn Effectively
                        </h2>
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            Powerful features designed to help you stay focused, track progress, and achieve your
                            learning goals faster.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map( ( feature ) => (
                            <Card
                                key={feature.title}
                                className="group border-transparent bg-card transition-all hover:border-border hover:shadow-md"
                            >
                                <CardContent className="pt-6">
                                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <feature.icon className="size-6" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ) )}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-foreground md:text-4xl">How It Works</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            Get started in minutes and begin your structured learning journey.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        {howItWorks.map( ( item, index ) => (
                            <div key={item.step} className="relative">
                                {index < howItWorks.length - 1 && (
                                    <div className="absolute left-1/2 top-8 hidden h-px w-full bg-border lg:block" />
                                )}
                                <div className="relative flex flex-col items-center text-center">
                                    <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                                        {item.step}
                                    </div>
                                    <h3 className="mt-6 text-lg font-semibold text-foreground">{item.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        ) )}
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="bg-muted/50 py-24">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-foreground md:text-4xl">Perfect for Every Learner</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
                            Whether you are preparing for interviews, learning new skills, or studying for exams,
                            GrowthOS adapts to your needs.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {useCases.map( ( useCase ) => (
                            <Card key={useCase.label} className="group cursor-pointer transition-all hover:shadow-md">
                                <CardContent className="flex items-center gap-4 pt-6">
                                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <useCase.icon className="size-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{useCase.label}</h3>
                                        <p className="text-sm text-muted-foreground">{useCase.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24">
                <div className="mx-auto max-w-7xl px-4">
                    <Card className="relative overflow-hidden border-0 bg-primary">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
                        <CardContent className="relative py-16 text-center">
                            <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
                                Ready to Start Your Learning Journey?
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
                                Join thousands of learners who are achieving their goals with structured learning paths
                                and progress tracking.
                            </p>
                            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link to="/app">
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="gap-2 bg-white text-primary hover:bg-white/90"
                                    >
                                        Get Started Free
                                        <ArrowRight className="size-4" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-primary-foreground/80">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4" />
                                    <span>Free forever plan</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="size-4" />
                                    <span>No credit card required</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-12">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <Logo />
                        <p className="text-sm text-muted-foreground">2026 GrowthOS. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
