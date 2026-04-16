import { Clock, Flame, CheckCircle2, Target, ArrowUpRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  statsData,
  weeklyStudyData,
  progressByCategory,
  recentActivity,
} from "@/services/mockData";

const statCards = [
  {
    title: "Total Study Hours",
    value: statsData.totalStudyHours,
    suffix: "hrs",
    icon: Clock,
    trend: "+12%",
    trendUp: true,
  },
  {
    title: "Current Streak",
    value: statsData.currentStreak,
    suffix: "days",
    icon: Flame,
    trend: "+3",
    trendUp: true,
  },
  {
    title: "Completed Items",
    value: statsData.completedItems,
    suffix: "",
    icon: CheckCircle2,
    trend: "+8",
    trendUp: true,
  },
  {
    title: "Active Goals",
    value: statsData.activeGoals,
    suffix: "",
    icon: Target,
    trend: "On track",
    trendUp: true,
  },
];

const activityBadgeVariant = {
  completed: "success",
  started: "default",
  added: "secondary",
  milestone: "warning",
} as const;

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Track your learning progress and stay consistent.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map( ( stat ) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="size-5 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-success">
                  <ArrowUpRight className="size-3" />
                  {stat.trend}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                  <span className="ml-1 text-base font-normal text-muted-foreground">
                    {stat.suffix}
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ) )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Study Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Study Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyStudyData}>
                  <XAxis
                    dataKey="day"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={( value ) => `${value}h`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                    formatter={( value: number ) => [ `${value} hours`, "Study Time" ]}
                  />
                  <Bar
                    dataKey="hours"
                    fill="var(--primary)"
                    radius={[ 6, 6, 0, 0 ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progress by Category Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Progress by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={progressByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {progressByCategory.map( ( entry, index ) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ) )}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                    }}
                    formatter={( value: number ) => [ `${value}%`, "Progress" ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {progressByCategory.map( ( category ) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {category.name}
                  </span>
                </div>
              ) )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {recentActivity.map( ( activity ) => (
              <div
                key={activity.id}
                className="flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {activity.path}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={activityBadgeVariant[activity.type]}>
                    {activity.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              </div>
            ) )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
