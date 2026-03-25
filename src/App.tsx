import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { usePasscodeAuth } from "@/hooks/usePasscodeAuth";
import { PasscodeModal } from "@/components/PasscodeModal";

// Pages
import Home from "@/pages/Home";
import AddProfile from "@/pages/AddProfile";
import Dashboard from "@/pages/Dashboard";
import EditProfile from "@/pages/EditProfile";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isVerified, isLoading, verify } = usePasscodeAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return <PasscodeModal onVerify={verify} />;
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Routes>
          {/* Home Page - Alumni Directory */}
          <Route path="/" element={<Home />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Add Profile Page */}
          <Route path="/add-profile" element={<AddProfile />} />

          {/* Edit Profile Page */}
          <Route path="/edit-profile" element={<EditProfile />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner richColors position="top-right" />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
