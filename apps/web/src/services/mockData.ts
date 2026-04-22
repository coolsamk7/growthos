// Stats data
export const statsData = {
  totalStudyHours: 156,
  currentStreak: 12,
  completedItems: 47,
  activeGoals: 5,
};

// Weekly study hours data for bar chart
export const weeklyStudyData = [
  { day: "Mon", hours: 3.5 },
  { day: "Tue", hours: 2.8 },
  { day: "Wed", hours: 4.2 },
  { day: "Thu", hours: 3.1 },
  { day: "Fri", hours: 5.0 },
  { day: "Sat", hours: 6.5 },
  { day: "Sun", hours: 4.8 },
];

// Progress by category for pie chart
export const progressByCategory = [
  { name: "System Design", value: 35, color: "var(--chart-1)" },
  { name: "Data Structures", value: 28, color: "var(--chart-2)" },
  { name: "Algorithms", value: 22, color: "var(--chart-3)" },
  { name: "Behavioral", value: 15, color: "var(--chart-4)" },
];

// Recent activity
export const recentActivity = [
  {
    id: "1",
    title: "Completed: Binary Trees Fundamentals",
    path: "Data Structures Mastery",
    time: "2 hours ago",
    type: "completed",
  },
  {
    id: "2",
    title: "Started: System Design Interview",
    path: "FAANG Preparation",
    time: "5 hours ago",
    type: "started",
  },
  {
    id: "3",
    title: "Added: React Performance Patterns",
    path: "Frontend Expert",
    time: "1 day ago",
    type: "added",
  },
  {
    id: "4",
    title: "Milestone: 50% of DSA Path",
    path: "Data Structures Mastery",
    time: "2 days ago",
    type: "milestone",
  },
  {
    id: "5",
    title: "Completed: Graph Algorithms",
    path: "Data Structures Mastery",
    time: "3 days ago",
    type: "completed",
  },
];

// Learning paths data
export const learningPaths = [
  {
    id: "1",
    title: "FAANG Interview Preparation",
    description: "Complete preparation for top tech company interviews",
    progress: 65,
    totalItems: 48,
    completedItems: 31,
    modules: [
      {
        id: "m1",
        title: "Data Structures",
        progress: 80,
        items: [
          { id: "i1", title: "Arrays & Strings", status: "completed", difficulty: "Easy" },
          { id: "i2", title: "Linked Lists", status: "completed", difficulty: "Easy" },
          { id: "i3", title: "Trees & Graphs", status: "in-progress", difficulty: "Medium" },
          { id: "i4", title: "Hash Tables", status: "completed", difficulty: "Easy" },
        ],
      },
      {
        id: "m2",
        title: "Algorithms",
        progress: 60,
        items: [
          { id: "i5", title: "Sorting Algorithms", status: "completed", difficulty: "Medium" },
          { id: "i6", title: "Binary Search", status: "completed", difficulty: "Easy" },
          { id: "i7", title: "Dynamic Programming", status: "in-progress", difficulty: "Hard" },
          { id: "i8", title: "Greedy Algorithms", status: "todo", difficulty: "Medium" },
        ],
      },
      {
        id: "m3",
        title: "System Design",
        progress: 40,
        items: [
          { id: "i9", title: "Scalability Basics", status: "completed", difficulty: "Medium" },
          { id: "i10", title: "Database Design", status: "in-progress", difficulty: "Hard" },
          { id: "i11", title: "Caching Strategies", status: "todo", difficulty: "Medium" },
          { id: "i12", title: "Load Balancing", status: "todo", difficulty: "Hard" },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "DevOps Engineering Path",
    description: "Master cloud infrastructure and automation",
    progress: 35,
    totalItems: 32,
    completedItems: 11,
    modules: [
      {
        id: "m4",
        title: "Linux Fundamentals",
        progress: 100,
        items: [
          { id: "i13", title: "Command Line Basics", status: "completed", difficulty: "Easy" },
          { id: "i14", title: "Shell Scripting", status: "completed", difficulty: "Medium" },
        ],
      },
      {
        id: "m5",
        title: "Containerization",
        progress: 50,
        items: [
          { id: "i15", title: "Docker Basics", status: "completed", difficulty: "Easy" },
          { id: "i16", title: "Docker Compose", status: "in-progress", difficulty: "Medium" },
          { id: "i17", title: "Kubernetes Intro", status: "todo", difficulty: "Hard" },
        ],
      },
    ],
  },
];

export type LearningPath = ( typeof learningPaths )[0];
export type Module = LearningPath["modules"][0];
export type ModuleItem = Module["items"][0];

