import { useParams, Link } from "react-router-dom";
import { mockAlumni } from "@/lib/mockData";
import { houseVariantMap } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, GraduationCap, Building, Heart } from "lucide-react";

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const alumni = mockAlumni.find((a) => a.id === id);

  if (!alumni) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Alumni not found.</p>
        <Button variant="outline" asChild className="mt-4">
          <Link to="/">Go Back</Link>
        </Button>
      </div>
    );
  }

  const initials = alumni.fullName.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to Directory
        </Link>
      </Button>

      <Card className="overflow-hidden">
        <div className="gradient-hero p-8 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-foreground/20 text-3xl font-heading font-bold text-primary-foreground backdrop-blur-sm">
            {initials}
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold text-primary-foreground">
            {alumni.fullName}
          </h1>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <Badge variant={houseVariantMap[alumni.house]}>{alumni.house}</Badge>
            <Badge variant="secondary">
              <GraduationCap className="mr-1 h-3 w-3" /> Batch {alumni.batch}
            </Badge>
          </div>
        </div>

        <CardContent className="space-y-6 p-6">
          {alumni.bio && (
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-1">About</h3>
              <p className="text-muted-foreground leading-relaxed">{alumni.bio}</p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoRow icon={Briefcase} label="Profession" value={alumni.profession} />
            <InfoRow icon={Building} label="Company" value={alumni.companyName} />
            <InfoRow icon={MapPin} label="City" value={alumni.currentCity} />
            {alumni.migrationJnv && <InfoRow icon={GraduationCap} label="Migration JNV" value={alumni.migrationJnv} />}
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-2 flex items-center gap-2">
              <Heart className="h-4 w-4 text-accent" /> Help Offered
            </h3>
            <div className="flex flex-wrap gap-2">
              {alumni.helpOffered.map((h) => (
                <Badge key={h} variant="help">{h}</Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <a href={`mailto:${alumni.email}`}>
                <Mail className="mr-1 h-4 w-4" /> Email
              </a>
            </Button>
            {alumni.phone && (
              <Button variant="hero" asChild>
                <a href={`https://wa.me/${alumni.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-1 h-4 w-4" /> WhatsApp
                </a>
              </Button>
            )}
            <Button variant="outline">Request Connection</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <div className="flex items-start gap-3 rounded-lg border bg-secondary/50 p-3">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium text-foreground">{value}</div>
    </div>
  </div>
);

export default ProfilePage;
