import { HOUSES, HELP_OPTIONS, House, HelpOffered } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface Filters {
  search: string;
  batch: string;
  city: string;
  profession: string;
  house: string;
  helpOffered: string;
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  cities: string[];
  professions: string[];
  batches: number[];
}

const FilterBar = ({ filters, onFilterChange, cities, professions, batches }: FilterBarProps) => {
  const update = (key: keyof Filters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="space-y-4 rounded-xl border bg-card p-4 shadow-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, company, or city..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Select value={filters.batch} onValueChange={(v) => update("batch", v)}>
          <SelectTrigger><SelectValue placeholder="Batch" /></SelectTrigger>
          <SelectContent>
            {batches.map((b) => (
              <SelectItem key={b} value={String(b)}>Batch {b}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.house} onValueChange={(v) => update("house", v)}>
          <SelectTrigger><SelectValue placeholder="House" /></SelectTrigger>
          <SelectContent>
            {HOUSES.map((h) => (
              <SelectItem key={h} value={h}>{h}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.city} onValueChange={(v) => update("city", v)}>
          <SelectTrigger><SelectValue placeholder="City" /></SelectTrigger>
          <SelectContent>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.profession} onValueChange={(v) => update("profession", v)}>
          <SelectTrigger><SelectValue placeholder="Profession" /></SelectTrigger>
          <SelectContent>
            {professions.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.helpOffered} onValueChange={(v) => update("helpOffered", v)}>
          <SelectTrigger><SelectValue placeholder="Help Offered" /></SelectTrigger>
          <SelectContent>
            {HELP_OPTIONS.map((h) => (
              <SelectItem key={h} value={h}>{h}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFilterChange({ search: "", batch: "", city: "", profession: "", house: "", helpOffered: "" })}
          className="text-muted-foreground"
        >
          <X className="mr-1 h-3.5 w-3.5" /> Clear filters
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
export type { Filters };
