export function LearningPathPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Learning Paths</h1>
        <p className="text-muted-foreground">
          Structured learning journeys to help you grow
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-2">Getting Started</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Begin your journey with foundational concepts
          </p>
          <div className="h-2 bg-secondary rounded-full">
            <div className="h-2 bg-primary rounded-full" style={{ width: '0%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
