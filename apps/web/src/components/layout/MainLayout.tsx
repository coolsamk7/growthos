import type { ReactNode } from 'react'
import { ThemeToggle } from '@/components/common'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/growthos_logo.svg" 
              alt="growthOS Logo" 
              className="h-10 w-auto"
            />
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium hover:text-[--color-primary] transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-[--color-primary] transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium hover:text-[--color-primary] transition-colors">
              Pricing
            </a>
            <ThemeToggle />
            <button className="px-4 py-2 bg-[--color-primary] hover:bg-[--color-primary-hover] text-white rounded-lg text-sm font-semibold transition-colors">
              Get Started
            </button>
          </nav>
          
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button className="px-4 py-2 bg-[--color-primary] hover:bg-[--color-primary-hover] text-white rounded-lg text-sm font-semibold transition-colors">
              Menu
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>
      
      <footer className="border-t mt-auto bg-[--color-surface]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img 
                  src="/growthos_logo.svg" 
                  alt="growthOS Logo" 
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Learn Smarter, Not Harder
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-[--color-primary] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[--color-primary] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[--color-primary] transition-colors">Learning Paths</a></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-[--color-primary] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[--color-primary] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[--color-primary] transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-[--color-primary] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[--color-primary] transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2026 growthOS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
