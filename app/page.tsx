"use client"

import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Globe,
  Lock,
  Palette,
  Rocket,
  Shield,
  Check,
  LogOut,
} from "lucide-react"
import { AnimatedList } from "@/components/ui/animated-list"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { MagicCard } from "@/components/ui/magic-card"
import { RetroGrid } from "@/components/ui/retro-grid"
import { ShinyButton } from "@/components/ui/shiny-button"
import { TextAnimate } from "@/components/ui/text-animate"
import { TypingAnimation } from "@/components/ui/typing-animation"
import { WordRotate } from "@/components/ui/word-rotate"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"

const features = [
  {
    Icon: Rocket,
    name: "Fast Performance",
    description:
      "Lightning-fast speed with optimized caching and edge delivery for the best user experience.",
    href: "#",
    cta: "Learn more",
    className: "md:col-span-1 md:row-span-2",
  },
  {
    Icon: Lock,
    name: "Secure & Reliable",
    description:
      "Enterprise-grade security with end-to-end encryption and 99.9% uptime guarantee.",
    href: "#",
    cta: "Learn more",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    Icon: BarChart3,
    name: "Analytics",
    description:
      "Powerful analytics dashboard to track metrics and gain actionable insights.",
    href: "#",
    cta: "Learn more",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    Icon: Palette,
    name: "Beautiful UI",
    description: "Stunning, modern design that looks great on any device.",
    href: "#",
    cta: "Learn more",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    Icon: Globe,
    name: "API First",
    description:
      "Build powerful integrations with our comprehensive REST and GraphQL APIs.",
    href: "#",
    cta: "Learn more",
    className: "md:col-span-1 md:row-span-1",
  },
  {
    Icon: Shield,
    name: "Affordable",
    description: "Flexible pricing plans that scale with your business needs.",
    href: "#",
    cta: "Learn more",
    className: "md:col-span-1 md:row-span-1",
  },
]

const steps = [
  { title: "Sign up for free" },
  { title: "Configure your workspace" },
  { title: "Deploy in minutes" },
  { title: "Scale effortlessly" },
]

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: [
      "Up to 3 projects",
      "Basic analytics",
      "Community support",
      "1GB storage",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    description: "For growing teams",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "100GB storage",
      "Custom integrations",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Dedicated support",
      "SLA guarantee",
      "Unlimited storage",
      "Custom contracts",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

function HeroSection() {
  const { data: session, isPending } = authClient.useSession()

  const user = session?.user
  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"

  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-20 md:px-8">
      <ThemeToggle />
      <div className="absolute inset-0 z-0">
        <RetroGrid
          className="opacity-30 dark:opacity-20"
          angle={65}
          cellSize={60}
          opacity={0.5}
          darkLineColor="rgba(255, 255, 255, 0.1)"
          lightLineColor="rgba(0, 0, 0, 0.1)"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background dark:from-background dark:via-background/80 dark:to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm backdrop-blur-sm dark:bg-background/20">
          <span className="flex h-2 w-2 items-center justify-center rounded-full bg-green-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          </span>
          <span className="text-muted-foreground">Now in public beta</span>
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          <TextAnimate animation="slideUp">Build Amazing</TextAnimate>
          <br />
          <WordRotate
            words={["Products", "Platforms", "Solutions", "Dreams"]}
            className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-white dark:via-purple-400 dark:to-pink-400"
            duration={3000}
          />
        </h1>

        <div className="mb-10 flex flex-col items-center gap-3 text-lg text-muted-foreground sm:text-xl md:text-2xl">
          <span>The best platform for</span>
          <TypingAnimation
            words={[
              "building startups",
              "creating SaaS",
              "launching products",
              "scaling businesses",
            ]}
            className="font-semibold text-foreground"
            duration={80}
            pauseDelay={2000}
            loop={true}
          />
        </div>

        {isPending ? (
          <div className="flex h-10 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : user ? (
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-border bg-background/50 px-4 py-2 backdrop-blur-sm">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {user.name || user.email}
              </span>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/dashboard">
                <ShinyButton className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-white dark:text-black">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </ShinyButton>
              </Link>
              <Button
                variant="outline"
                onClick={() =>
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = "/"
                      },
                    },
                  })
                }
                className="border border-border bg-background text-foreground hover:bg-secondary/50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/sign-up">
              <ShinyButton className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-white dark:text-black">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </ShinyButton>
            </Link>
            <Link href="/sign-in">
              <ShinyButton className="border border-border bg-background text-foreground hover:bg-secondary/50 dark:bg-transparent dark:hover:bg-white/10">
                Sign In
              </ShinyButton>
            </Link>
          </div>
        )}

        <div className="mt-16 flex items-center gap-8 text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-foreground">10K+</span>
            <span>Users</span>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-foreground">99.9%</span>
            <span>Uptime</span>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl font-bold text-foreground">50+</span>
            <span>Countries</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section className="relative px-4 py-24 md:px-8 lg:py-32">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <TextAnimate
            animation="slideUp"
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            Everything You Need
          </TextAnimate>
          <TextAnimate
            animation="fadeIn"
            delay={0.2}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Powerful features to help you build, launch, and scale your products
            faster than ever.
          </TextAnimate>
        </div>

        <BentoGrid className="mx-auto max-w-6xl">
          {features.map((feature) => (
            <BentoCard
              key={feature.name}
              {...feature}
              background={
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 dark:from-white/5 dark:to-purple-500/10" />
              }
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 md:px-8 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background dark:via-white/5" />

      <div className="relative container mx-auto">
        <div className="mb-16 text-center">
          <TextAnimate
            animation="slideUp"
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            How It Works
          </TextAnimate>
          <TextAnimate
            animation="fadeIn"
            delay={0.2}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Get started in minutes with our simple four-step process.
          </TextAnimate>
        </div>

        <div className="mx-auto max-w-2xl">
          <AnimatedList delay={1500}>
            {steps.map((step, index) => (
              <MagicCard
                key={index}
                className="mb-4 cursor-default bg-card p-6 dark:bg-card/50"
                gradientSize={150}
                gradientOpacity={0.3}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <span className="text-lg font-medium">{step.title}</span>
                </div>
              </MagicCard>
            ))}
          </AnimatedList>
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section className="relative px-4 py-24 md:px-8 lg:py-32">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <TextAnimate
            animation="slideUp"
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
          >
            Simple Pricing
          </TextAnimate>
          <TextAnimate
            animation="fadeIn"
            delay={0.2}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Choose the plan that fits your needs. No hidden fees.
          </TextAnimate>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {pricingTiers.map((tier) => (
            <MagicCard
              key={tier.name}
              className={`relative flex flex-col bg-card p-8 dark:bg-card/50 ${
                tier.popular ? "border-primary md:scale-105" : "border-border"
              }`}
              gradientSize={200}
              gradientOpacity={tier.popular ? 0.5 : 0.3}
              gradientFrom={tier.popular ? "#9E7AFF" : "#262626"}
              gradientTo={tier.popular ? "#FE8BBB" : "#262626"}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-purple-500 px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold">{tier.name}</h3>
                <p className="mt-2 text-muted-foreground">{tier.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.price !== "Custom" && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <ShinyButton
                className={`w-full ${
                  tier.popular
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background"
                }`}
              >
                {tier.cta}
              </ShinyButton>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 md:px-8 lg:py-40">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/10 to-background dark:via-white/10" />
        <RetroGrid
          className="opacity-20"
          angle={65}
          cellSize={60}
          opacity={0.3}
          darkLineColor="rgba(255, 255, 255, 0.1)"
          lightLineColor="rgba(0, 0, 0, 0.1)"
        />
      </div>

      <div className="relative container mx-auto text-center">
        <TextAnimate
          animation="slideUp"
          className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Ready to Get Started?
        </TextAnimate>
        <TextAnimate
          animation="fadeIn"
          delay={0.2}
          className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground"
        >
          Join thousands of developers who are already building amazing
          products.
        </TextAnimate>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <ShinyButton className="bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-white dark:text-black">
            Start Building Today <ArrowRight className="ml-2 h-4 w-4" />
          </ShinyButton>
          <ShinyButton className="border border-border bg-background text-foreground hover:bg-secondary/50 dark:bg-transparent dark:hover:bg-white/10">
            Contact Sales
          </ShinyButton>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 px-4 py-12 md:px-8">
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Rocket className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold">BuildPro</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Pricing
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Docs
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Blog
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Contact
            </a>
          </nav>

          <p className="text-sm text-muted-foreground">
            © 2026 BuildPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}
