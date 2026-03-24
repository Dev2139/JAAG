import { useState, useMemo } from "react";
import { mockOpportunities } from "@/lib/mockOpportunities";
import { OPPORTUNITY_TYPES, OpportunityType } from "@/lib/types";
import OpportunityCard from "@/components/OpportunityCard";
import PostOpportunityDialog from "@/components/PostOpportunityDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Briefcase, GraduationCap, Lightbulb, Users } from "lucide-react";

const typeIcons: Record<string, any> = {
  Job: Briefcase,
  Internship: GraduationCap,
  Freelance: Lightbulb,
  Mentorship: Users,
};

const OpportunityBoard = () => {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [showPostDialog, setShowPostDialog] = useState(false);

  const filtered = useMemo(() => {
    return mockOpportunities.filter((op) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !op.title.toLowerCase().includes(q) &&
          !op.company.toLowerCase().includes(q) &&
          !op.location.toLowerCase().includes(q) &&
          !op.description.toLowerCase().includes(q)
        )
          return false;
      }
      if (selectedType && op.type !== selectedType) return false;
      return true;
    });
  }, [search, selectedType]);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    mockOpportunities.forEach((op) => {
      map[op.type] = (map[op.type] || 0) + 1;
    });
    return map;
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero banner */}
      <section className="relative overflow-hidden gradient-warm py-12 sm:py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-primary-foreground" />
          <div className="absolute bottom-0 right-10 h-32 w-32 rounded-full bg-primary-foreground" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl">
            Opportunity Board
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Jobs, internships, and mentorship opportunities shared by fellow Navodayans.
            Give back to the community or find your next big break.
          </p>
          <Button
            variant="hero"
            size="lg"
            className="mt-6"
            onClick={() => setShowPostDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Post an Opportunity
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {OPPORTUNITY_TYPES.map((type) => {
            const Icon = typeIcons[type];
            const isActive = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(isActive ? "" : type)}
                className={`flex items-center gap-3 rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${
                  isActive
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-heading font-bold text-foreground">{counts[type] || 0}</div>
                  <div className="text-xs text-muted-foreground">{type}s</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search opportunities by title, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Active filters */}
        {selectedType && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtering:</span>
            <Badge variant="default" className="cursor-pointer" onClick={() => setSelectedType("")}>
              {selectedType} ×
            </Badge>
          </div>
        )}

        {/* Results */}
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            {filtered.length} Opportunit{filtered.length === 1 ? "y" : "ies"}
          </h2>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">No opportunities match your search.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((op, i) => (
              <OpportunityCard key={op.id} opportunity={op} index={i} />
            ))}
          </div>
        )}
      </div>

      <PostOpportunityDialog open={showPostDialog} onOpenChange={setShowPostDialog} />
    </div>
  );
};

export default OpportunityBoard;
