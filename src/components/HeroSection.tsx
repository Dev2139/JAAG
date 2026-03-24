import { Users, GraduationCap, Building, Heart, Briefcase, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const stats = [
    { icon: Users, label: "Alumni", value: "500+", color: "bg-house-nilgiri" },
    { icon: GraduationCap, label: "Batches", value: "20+", color: "bg-house-shivalik" },
    { icon: Building, label: "Cities", value: "50+", color: "bg-house-aravali" },
    { icon: Heart, label: "Connections", value: "1K+", color: "bg-house-udaygiri" },
  ];

  return (
    <section className="relative overflow-hidden gradient-hero py-16 sm:py-24">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-house-aravali opacity-10 blur-3xl" />
        <div className="absolute bottom-0 -left-16 h-56 w-56 rounded-full bg-house-udaygiri opacity-10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary-foreground opacity-[0.03] blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-sm text-primary-foreground/80 backdrop-blur-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-house-shivalik opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-house-shivalik" />
          </span>
          Navodaya Alumni Network — Open for all batches
        </div>

        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
          JNV Alumni
          <span className="block mt-1 bg-gradient-to-r from-house-aravali to-primary-foreground bg-clip-text text-transparent">
            Connect
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-primary-foreground/80 leading-relaxed">
          Reconnect with your Navodaya family. Find batchmates, explore career opportunities,
          and give back to the community that shaped us.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="warm" size="lg" asChild>
            <Link to="/register">Join the Network</Link>
          </Button>
          <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
            <Link to="/opportunities">
              <Briefcase className="mr-2 h-4 w-4" />
              Opportunities
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="group rounded-xl bg-primary-foreground/10 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-primary-foreground/15 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${i * 100 + 300}ms` }}
            >
              <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="mt-2 text-2xl font-heading font-bold text-primary-foreground">{stat.value}</div>
              <div className="text-xs text-primary-foreground/70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
