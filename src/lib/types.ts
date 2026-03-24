export type House = "Aravali" | "Nilgiri" | "Shivalik" | "Udaygiri";

export type HelpOffered = 
  | "Mentorship" 
  | "Career Guidance" 
  | "Job Opportunities" 
  | "Project Collaboration" 
  | "Internship Opportunities" 
  | "Technical Support" 
  | "Business Advice" 
  | "Interview Preparation";

export type OpportunityType = "Job" | "Internship" | "Mentorship" | "Collaboration" | "Other";

// Profile interface matching database structure
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  batch_year: number;
  house: House;
  migration_jnv?: string;
  profession: string;
  company_name: string;
  current_city: string;
  bio: string;
  profile_image_url: string | null;
  help_offered: HelpOffered[];
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

// Legacy Alumni type for backward compatibility
export interface Alumni {
  id: string;
  fullName: string;
  batch: number;
  house: House;
  migrationJnv?: string;
  profession: string;
  companyName: string;
  currentCity: string;
  helpOffered: HelpOffered[];
  bio: string;
  photoUrl: string;
  email: string;
  phone?: string;
  approved: boolean;
}

export interface Opportunity {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: OpportunityType;
  company_name?: string;
  requirements?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject?: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// Constants
export const HOUSES: House[] = ["Aravali", "Nilgiri", "Shivalik", "Udaygiri"];

export const HELP_OPTIONS: HelpOffered[] = [
  "Mentorship",
  "Career Guidance",
  "Job Opportunities",
  "Project Collaboration",
  "Internship Opportunities",
  "Technical Support",
  "Business Advice",
  "Interview Preparation",
];

export const OPPORTUNITY_TYPES: OpportunityType[] = ["Job", "Internship", "Mentorship", "Collaboration", "Other"];

export const houseVariantMap: Record<House, "aravali" | "nilgiri" | "shivalik" | "udaygiri"> = {
  Aravali: "aravali",
  Nilgiri: "nilgiri",
  Shivalik: "shivalik",
  Udaygiri: "udaygiri",
};
