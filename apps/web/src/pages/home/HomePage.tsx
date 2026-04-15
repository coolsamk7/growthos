export function HomePage() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section id="hero" className="text-center space-y-8 pt-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            🚀 Build Your Learning Path.
            <br />
            Track Your Growth.
            <br />
            <span className="bg-gradient-to-r from-[--color-primary] to-[--color-accent-purple] bg-clip-text text-transparent">
              Crack Your Goals.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Stop jumping between random tutorials.
            Create a structured roadmap, track your progress, and stay consistent — all in one place.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-[--color-primary] hover:bg-[--color-primary-hover] text-white rounded-lg font-semibold text-lg transition-colors">
            Get Started Free
          </button>
          <button className="px-8 py-4 border-2 border-[--color-primary] text-[--color-primary] rounded-lg font-semibold text-lg hover:bg-[--color-primary] hover:text-white transition-colors">
            Explore Learning Paths
          </button>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="about" className="max-w-4xl mx-auto text-center space-y-4">
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">growthOS</span> is a smart learning platform that helps you design your own study plan, 
          follow curated roadmaps, and track your daily progress with powerful analytics.
        </p>
        <p className="text-lg text-muted-foreground">
          Whether you're preparing for <span className="font-semibold text-foreground">FAANG</span>, <span className="font-semibold text-foreground">DevOps</span>, <span className="font-semibold text-foreground">UPSC</span>, or anything else — we've got you covered.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">🔥 Features</h2>
          <p className="text-muted-foreground text-lg">Everything you need to succeed in your learning journey</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="space-y-3 p-6 rounded-xl border bg-card hover:shadow-lg hover:border-[--color-primary] transition-all">
            <div className="text-5xl mb-2">📚</div>
            <h3 className="text-2xl font-bold">Create Your Own Learning Path</h3>
            <p className="text-muted-foreground">
              Design your roadmap your way. Start from scratch or pick from curated templates and customize them based on your goals.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-3 p-6 rounded-xl border bg-card hover:shadow-lg hover:border-[--color-primary] transition-all">
            <div className="text-5xl mb-2">🧠</div>
            <h3 className="text-2xl font-bold">Use Proven Roadmaps</h3>
            <p className="text-muted-foreground">
              Choose from expert-designed paths like FAANG Prep, DevOps Roadmap, and more. No more confusion — just follow what works.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-3 p-6 rounded-xl border bg-card hover:shadow-lg hover:border-[--color-primary] transition-all">
            <div className="text-5xl mb-2">📊</div>
            <h3 className="text-2xl font-bold">Track Every Minute You Study</h3>
            <p className="text-muted-foreground">
              Log your study sessions, monitor progress, and see where you're improving or falling behind.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="space-y-3 p-6 rounded-xl border bg-card hover:shadow-lg hover:border-[--color-primary] transition-all">
            <div className="text-5xl mb-2">🔥</div>
            <h3 className="text-2xl font-bold">Stay Consistent with Streaks</h3>
            <p className="text-muted-foreground">
              Build daily habits and maintain streaks to stay motivated and disciplined.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="space-y-3 p-6 rounded-xl border bg-card hover:shadow-lg hover:border-[--color-primary] transition-all">
            <div className="text-5xl mb-2">🎯</div>
            <h3 className="text-2xl font-bold">Set Goals and Achieve Them</h3>
            <p className="text-muted-foreground">
              Set clear study goals and track how close you are to achieving them.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">🧩 How It Works</h2>
          <p className="text-muted-foreground text-lg">Get started in 4 simple steps</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center space-y-4 p-6">
            <div className="w-16 h-16 bg-[--color-primary] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto">
              1
            </div>
            <h3 className="text-xl font-bold">Choose a Learning Path</h3>
            <p className="text-muted-foreground">
              Pick from curated templates or create your own.
            </p>
          </div>

          <div className="text-center space-y-4 p-6">
            <div className="w-16 h-16 bg-[--color-primary] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto">
              2
            </div>
            <h3 className="text-xl font-bold">Customize Your Plan</h3>
            <p className="text-muted-foreground">
              Add or remove topics based on your needs.
            </p>
          </div>

          <div className="text-center space-y-4 p-6">
            <div className="w-16 h-16 bg-[--color-primary] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto">
              3
            </div>
            <h3 className="text-xl font-bold">Start Studying</h3>
            <p className="text-muted-foreground">
              Track your time and mark progress.
            </p>
          </div>

          <div className="text-center space-y-4 p-6">
            <div className="w-16 h-16 bg-[--color-primary] text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto">
              4
            </div>
            <h3 className="text-xl font-bold">Analyze & Improve</h3>
            <p className="text-muted-foreground">
              Use insights to focus on weak areas.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">🎯 Who is this for?</h2>
        </div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:border-[--color-success] transition-colors">
            <span className="text-2xl">✔</span>
            <p className="text-lg">Software Engineers preparing for <span className="font-semibold">FAANG</span></p>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:border-[--color-success] transition-colors">
            <span className="text-2xl">✔</span>
            <p className="text-lg">Students preparing for <span className="font-semibold">UPSC, CAT, or exams</span></p>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:border-[--color-success] transition-colors">
            <span className="text-2xl">✔</span>
            <p className="text-lg"><span className="font-semibold">DevOps / Backend</span> engineers learning new skills</p>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:border-[--color-success] transition-colors">
            <span className="text-2xl">✔</span>
            <p className="text-lg">Anyone serious about <span className="font-semibold">structured learning</span></p>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="testimonials" className="space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">⭐ What Users Say</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-6 rounded-xl border bg-card space-y-4 hover:border-[--color-accent-purple] transition-colors">
            <p className="text-lg italic">
              "Finally, a platform where I can track everything in one place. No more scattered notes!"
            </p>
            <p className="text-sm text-muted-foreground font-semibold">— Early User</p>
          </div>
          
          <div className="p-6 rounded-xl border bg-card space-y-4 hover:border-[--color-accent-cyan] transition-colors">
            <p className="text-lg italic">
              "Helped me stay consistent for 30+ days. Game changer."
            </p>
            <p className="text-sm text-muted-foreground font-semibold">— Developer</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="text-center space-y-8 py-16 px-6 rounded-2xl bg-gradient-to-r from-[--color-primary]/10 to-[--color-accent-purple]/10 border">
        <h2 className="text-4xl md:text-5xl font-bold">
          🚀 Ready to take control of your learning?
        </h2>
        <p className="text-xl text-muted-foreground">
          Start building your roadmap today.
        </p>
        <button className="px-10 py-5 bg-[--color-primary] hover:bg-[--color-primary-hover] text-white rounded-lg font-semibold text-xl transition-colors">
          Create Your First Learning Path
        </button>
      </section>
    </div>
  )
}
