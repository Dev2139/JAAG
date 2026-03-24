import { Opportunity } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building, Calendar, ExternalLink, Mail, Clock, IndianRupee, Wifi } from "lucide-react";

interface OpportunityCardProps {
  opportunity: Opportunity;
  index: number;
}

const typeColorMap: Record<string, string> = {
  Job: "bg-primary text-primary-foreground",
  Internship: "bg-house-shivalik text-primary-foreground",
  Freelance: "bg-house-aravali text-foreground",
  Mentorship: "bg-house-udaygiri text-primary-foreground",
};

const OpportunityCard = ({ opportunity, index }: OpportunityCardProps) => {
  const daysAgo = Math.floor(
    (Date.now() - new Date(opportunity.postedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card
      className="group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-heading font-semibold text-lg text-card-foreground leading-tight">
              {opportunity.title}
            </h3>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
              <Building className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{opportunity.company}</span>
            </div>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${typeColorMap[opportunity.type]}`}>
            {opportunity.type}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 text-sm">
        <p className="text-muted-foreground line-clamp-2 leading-relaxed">
          {opportunity.description}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {opportunity.location}
          </span>
          {opportunity.isRemote && (
            <span className="flex items-center gap-1 text-accent">
              <Wifi className="h-3 w-3" />
              Remote
            </span>
          )}
          {opportunity.salary && (
            <span className="flex items-center gap-1">
              <IndianRupee className="h-3 w-3" />
              {opportunity.salary}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {opportunity.requirements.slice(0, 3).map((req) => (
            <Badge key={req} variant="secondary" className="text-[10px]">
              {req}
            </Badge>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Posted by <span className="font-medium text-foreground">{opportunity.postedByName}</span>
        </p>
      </CardContent>

      <CardFooter className="gap-2">
        {opportunity.applyUrl ? (
          <Button size="sm" className="flex-1" asChild>
            <a href={opportunity.applyUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              Apply
            </a>
          </Button>
        ) : (
          <Button size="sm" className="flex-1" asChild>
            <a href={`mailto:${opportunity.contactEmail}?subject=Regarding: ${encodeURIComponent(opportunity.title)}`}>
              <Mail className="mr-1 h-3.5 w-3.5" />
              Contact
            </a>
          </Button>
        )}
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <a href={`mailto:${opportunity.contactEmail}?subject=Regarding: ${encodeURIComponent(opportunity.title)}`}>
            <Mail className="mr-1 h-3.5 w-3.5" />
            Email
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OpportunityCard;
