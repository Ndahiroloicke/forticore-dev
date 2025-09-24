
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

            {/* App routes with Layout */}
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
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
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
