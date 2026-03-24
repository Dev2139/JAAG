import { Alumni, houseVariantMap } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, GraduationCap, User } from "lucide-react";
import { Link } from "react-router-dom";

interface AlumniCardProps {
  alumni: Alumni;
  index: number;
}

const AlumniCard = ({ alumni, index }: AlumniCardProps) => {
  const initials = alumni.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-heading font-bold text-lg">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading font-semibold text-lg truncate text-card-foreground">
              {alumni.fullName}
            </h3>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge variant={houseVariantMap[alumni.house]} className="text-[11px]">
                {alumni.house}
              </Badge>
              <Badge variant="secondary" className="text-[11px]">
                <GraduationCap className="mr-1 h-3 w-3" />
                Batch {alumni.batch}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">
            {alumni.profession} at {alumni.companyName}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{alumni.currentCity}</span>
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          {alumni.helpOffered.map((help) => (
            <Badge key={help} variant="help" className="text-[11px]">
              {help}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to={`/profile/${alumni.id}`}>
            <User className="mr-1 h-3.5 w-3.5" />
            View Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlumniCard;
