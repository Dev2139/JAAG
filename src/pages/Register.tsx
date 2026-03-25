import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Flame, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { HOUSES, HELP_OPTIONS, HelpOffered } from "@/lib/types";
import { useAuthContext } from "@/lib/supabase/AuthContext";
import { useDatabase } from "@/hooks/useDatabase";

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuthContext();
  const { insert } = useDatabase();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'basic' | 'profile'>('basic');

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    batch: "",
    house: "",
    migrationJnv: "",
    profession: "",
    companyName: "",
    currentCity: "",
    bio: "",
    profilePassword: "",
    contactNumber: "",
    showContactNumber: true,
  });
  const [helpOffered, setHelpOffered] = useState<HelpOffered[]>([]);

  const update = (key: string, value: string) => setForm({ ...form, [key]: value });

  const toggleHelp = (h: HelpOffered) => {
    setHelpOffered((prev) => prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password || !form.batch || !form.house) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep('profile');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.profilePassword) {
      toast.error("Profile password is required");
      return;
    }
    
    setLoading(true);
    try {
      // Create auth user
      await signUp(form.email, form.password);
      
      // Create profile in database
      await insert("profiles", {
        full_name: form.fullName,
        email: form.email,
        batch_year: form.batch,
        house: form.house,
        migration_jnv: form.migrationJnv,
        profession: form.profession,
        company_name: form.companyName,
        current_city: form.currentCity,
        bio: form.bio,
        help_offered: helpOffered,
        profile_password: form.profilePassword,
        contact_number: form.contactNumber,
        show_contact_number: form.showContactNumber === "true" || form.showContactNumber === true,
      });

      toast.success("Profile created! Please verify your email.");
      navigate("/login");
    } catch (error: any) {
      const message = error?.message || "Failed to register";
      if (message.includes('401') || message.includes('Unauthorized')) {
        toast.error("❌ Supabase not configured. Check console and update .env.local");
      } else if (message.includes('User already registered')) {
        toast.error("This email is already registered");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center text-white px-8">
          <div className="h-24 w-24 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <Flame className="h-12 w-12" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Join JNV Connect</h1>
          <p className="text-xl text-purple-100 mb-8">
            Be part of the largest JNV Alumni community
          </p>
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-lg">
              <ChevronRight className="h-6 w-6 flex-shrink-0" />
              <span>Discover job opportunities</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <ChevronRight className="h-6 w-6 flex-shrink-0" />
              <span>Reconnect with classmates</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <ChevronRight className="h-6 w-6 flex-shrink-0" />
              <span>Get mentored by seniors</span>
            </div>
            <div className="flex items-center gap-3 text-lg">
              <ChevronRight className="h-6 w-6 flex-shrink-0" />
              <span>Mentor juniors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="h-16 w-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Flame className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JNV Connect
            </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">
              {step === 'basic' ? 'Step 1: Basic Information' : 'Step 2: Profile Details'}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 mb-8">
            <div className={`flex-1 h-2 rounded-full ${step === 'basic' || step === 'profile' ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex-1 h-2 rounded-full ${step === 'profile' ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>

          {step === 'basic' ? (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  placeholder="Your full name"
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  className="h-12 rounded-lg"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="h-12 rounded-lg"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  className="h-12 rounded-lg"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="batch" className="block text-sm font-medium text-gray-900 mb-2">
                  Batch (Class 12 Year) *
                </Label>
                <Input
                  id="batch"
                  type="number"
                  placeholder="e.g. 2015"
                  value={form.batch}
                  onChange={(e) => update("batch", e.target.value)}
                  className="h-12 rounded-lg"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="house" className="block text-sm font-medium text-gray-900 mb-2">
                  House *
                </Label>
                <Select value={form.house} onValueChange={(v) => update("house", v)} disabled={loading}>
                  <SelectTrigger className="h-12 rounded-lg">
                    <SelectValue placeholder="Select House" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOUSES.map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold"
                disabled={loading}
              >
                Continue
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="migrationJnv" className="block text-sm font-medium text-gray-900 mb-2">
                  Migration JNV
                </Label>
                <Input
                  id="migrationJnv"
                  placeholder="e.g. JNV Jaipur"
                  value={form.migrationJnv}
                  onChange={(e) => update("migrationJnv", e.target.value)}
                  className="h-12 rounded-lg"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="profession" className="block text-sm font-medium text-gray-900 mb-2">
                  Profession
                </Label>
                <Input
                  id="profession"
                  placeholder="e.g. Software Engineer"
                  value={form.profession}
                  onChange={(e) => update("profession", e.target.value)}
                  className="h-12 rounded-lg"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="companyName" className="block text-sm font-medium text-gray-900 mb-2">
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  placeholder="e.g. Google"
                  value={form.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                  className="h-12 rounded-lg"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="currentCity" className="block text-sm font-medium text-gray-900 mb-2">
                  Current City
                </Label>
                <Input
                  id="currentCity"
                  placeholder="e.g. Bangalore"
                  value={form.currentCity}
                  onChange={(e) => update("currentCity", e.target.value)}
                  className="h-12 rounded-lg"
                  disabled={loading}
                />
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-900 mb-3">
                  Help You Can Offer
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {HELP_OPTIONS.map((h) => (
                    <div key={h} className="flex items-center gap-2">
                      <Checkbox
                        id={h}
                        checked={helpOffered.includes(h)}
                        onCheckedChange={() => toggleHelp(h)}
                        disabled={loading}
                      />
                      <Label htmlFor={h} className="text-sm cursor-pointer font-normal">{h}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="block text-sm font-medium text-gray-900 mb-2">
                  Bio / About
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  className="rounded-lg resize-none"
                  rows={3}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="contactNumber" className="block text-sm font-medium text-gray-900 mb-2">
                  Contact Number (Optional)
                </Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder="e.g. +91 98765 43210"
                  value={form.contactNumber}
                  onChange={(e) => update("contactNumber", e.target.value)}
                  className="h-12 rounded-lg"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Checkbox
                  id="showContactNumber"
                  checked={form.showContactNumber}
                  onCheckedChange={(checked) => update("showContactNumber", checked ? "true" : "false")}
                  disabled={loading}
                />
                <Label htmlFor="showContactNumber" className="text-sm cursor-pointer font-normal text-gray-700">
                  Let others see my contact number
                </Label>
              </div>

              <div>
                <Label htmlFor="profilePassword" className="block text-sm font-medium text-gray-900 mb-2">
                  Profile Password * <span className="text-xs text-gray-500">(For future profile updates)</span>
                </Label>
                <Input
                  id="profilePassword"
                  type="password"
                  placeholder="Create a password to update your profile later"
                  value={form.profilePassword}
                  onChange={(e) => update("profilePassword", e.target.value)}
                  className="h-12 rounded-lg"
                  disabled={loading}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  You'll need this password to update your profile or change your settings in the future
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-12 rounded-lg"
                  onClick={() => setStep('basic')}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <UserPlus className="h-5 w-5" />
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
