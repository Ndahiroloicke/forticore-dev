
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "@/pages/Index";
import Installation from "@/pages/Installation";
import Documentation from "@/pages/Documentation";
import NotFound from "@/pages/NotFound";
import QuickStart from "@/pages/quick-start";
import Features from "@/pages/features";
import Configuration from "@/pages/configuration";
import Integration from "@/pages/integration";
import Customization from "@/pages/customization";
import FAQ from "@/pages/faq";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import AuthCallback from "@/pages/AuthCallback";
import Trends from "@/pages/Trends";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth routes without Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/trends" element={<Trends />} />

            {/* Protected app routes without public Layout (custom UI) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* Public app routes with site Layout */}
            <Route element={<Layout />}> 
              <Route path="/" element={<Index />} />
              <Route path="/installation" element={<Installation />} />
              <Route path="/documentation" element={<Documentation />} />
              <Route path="/quick-start" element={<QuickStart />} />
              <Route path="/features" element={<Features />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/integration" element={<Integration />} />
              <Route path="/customization" element={<Customization />} />
              <Route path="/faq" element={<FAQ />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
