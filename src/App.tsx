
import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { AuthProvider } from "./context/AuthContext";

// Lazy load pages for better code splitting
const HomePage = lazy(() => import("./pages/Index"));
const LoginPage = lazy(() => import("./pages/auth/Login"));
const SignupPage = lazy(() => import("./pages/auth/Signup"));
const DesignPage = lazy(() => import("./pages/design/Design"));
const DesignsListPage = lazy(() => import("./pages/design/DesignsList"));
const UserDashboard = lazy(() => import("./pages/user/Dashboard"));
const ProfilePage = lazy(() => import("./pages/user/Profile"));
const PricingPage = lazy(() => import("./pages/Pricing"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorks"));
const NotFound = lazy(() => import("./pages/NotFound"));
const QuestionStatisticsPage = lazy(() => import("./pages/admin/QuestionStatistics"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin h-10 w-10 border-4 border-brand-green border-t-transparent rounded-full"></div></div>}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/design" element={<DesignPage />} />
                  <Route path="/designs" element={<DesignsListPage />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/admin/question-statistics" element={<QuestionStatisticsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
