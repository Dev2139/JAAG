import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import { verifyProfilePassword, doPasswordsMatch, validatePasswordStrength } from "@/lib/passwordUtils";

interface ChangeProfilePasswordProps {
  userId: string;
  currentPassword: string;
}

export const ChangeProfilePassword = ({ userId, currentPassword }: ChangeProfilePasswordProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    } else if (!verifyProfilePassword(formData.oldPassword, currentPassword)) {
      newErrors.oldPassword = "Current password is incorrect";
    }

    const passwordValidation = validatePasswordStrength(formData.newPassword);
    if (!passwordValidation.isValid) {
      newErrors.newPassword = passwordValidation.message;
    }

    if (!doPasswordsMatch(formData.newPassword, formData.confirmPassword)) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ profile_password: formData.newPassword })
        .eq("id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile password changed successfully!",
      });

      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setOpen(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <Lock className="h-4 w-4" />
        Change Profile Password
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Profile Password</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div>
              <Label htmlFor="oldPassword" className="block text-sm font-medium text-gray-900 mb-2">
                Current Profile Password
              </Label>
              <Input
                id="oldPassword"
                type="password"
                placeholder="Enter your current password"
                value={formData.oldPassword}
                onChange={(e) => handleChange("oldPassword", e.target.value)}
                className="h-10 rounded-lg"
              />
              {errors.oldPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.oldPassword}</p>
              )}
            </div>

            <div>
              <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-900 mb-2">
                New Profile Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter a new password (min. 6 characters)"
                value={formData.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                className="h-10 rounded-lg"
              />
              {errors.newPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className="h-10 rounded-lg"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </form>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {loading ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangeProfilePassword;
