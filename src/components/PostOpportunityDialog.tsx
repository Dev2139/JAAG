import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { OPPORTUNITY_TYPES } from "@/lib/types";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface PostOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PostOpportunityDialog = ({ open, onOpenChange }: PostOpportunityDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    description: "",
    requirements: "",
    contactEmail: "",
    applyUrl: "",
    salary: "",
    isRemote: false,
  });

  const update = (key: string, value: string | boolean) => setForm({ ...form, [key]: value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.type || !form.contactEmail || !form.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("Opportunity posted! It will be visible after admin approval.");
      setLoading(false);
      onOpenChange(false);
      setForm({
        title: "", company: "", location: "", type: "", description: "",
        requirements: "", contactEmail: "", applyUrl: "", salary: "", isRemote: false,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Post an Opportunity</DialogTitle>
          <DialogDescription>Share a job, internship, or mentorship with fellow Navodayans.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input placeholder="e.g. Frontend Developer" value={form.title} onChange={(e) => update("title", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Company *</Label>
              <Input placeholder="e.g. Google" value={form.company} onChange={(e) => update("company", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={form.type} onValueChange={(v) => update("type", v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {OPPORTUNITY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input placeholder="e.g. Bangalore" value={form.location} onChange={(e) => update("location", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Contact Email *</Label>
              <Input type="email" placeholder="you@example.com" value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Apply URL</Label>
              <Input placeholder="https://..." value={form.applyUrl} onChange={(e) => update("applyUrl", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Salary / Stipend</Label>
              <Input placeholder="e.g. ₹18-25 LPA" value={form.salary} onChange={(e) => update("salary", e.target.value)} />
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remote"
                  checked={form.isRemote}
                  onCheckedChange={(v) => update("isRemote", !!v)}
                />
                <Label htmlFor="remote" className="cursor-pointer">Remote friendly</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              placeholder="Describe the opportunity, responsibilities, and what you're looking for..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Requirements (comma separated)</Label>
            <Input
              placeholder="e.g. React, TypeScript, 2+ years experience"
              value={form.requirements}
              onChange={(e) => update("requirements", e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            <Send className="mr-2 h-4 w-4" />
            {loading ? "Posting..." : "Post Opportunity"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PostOpportunityDialog;
