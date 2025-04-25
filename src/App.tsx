
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CoinShop from "./pages/CoinShop";
import Tasks from "./pages/Tasks";
import Planner from "./pages/Planner";
import Templates from "./pages/Templates";
import Friends from "./pages/Friends";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

// Import framer-motion for animations
import { MotionConfig } from "framer-motion";

const queryClient = new QueryClient();

// Auth route guard component
const AuthRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  if (loading) return null;
  
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MotionConfig reducedMotion="user">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/" element={
              <AuthRoute>
                <Index />
              </AuthRoute>
            } />
            <Route path="/shop" element={
              <AuthRoute>
                <CoinShop />
              </AuthRoute>
            } />
            <Route path="/tasks" element={
              <AuthRoute>
                <Tasks />
              </AuthRoute>
            } />
            <Route path="/planner" element={
              <AuthRoute>
                <Planner />
              </AuthRoute>
            } />
            <Route path="/templates" element={
              <AuthRoute>
                <Templates />
              </AuthRoute>
            } />
            <Route path="/friends" element={
              <AuthRoute>
                <Friends />
              </AuthRoute>
            } />
            
            {/* Redirect /calendar to /planner since we're replacing it */}
            <Route path="/calendar" element={
              <AuthRoute>
                <Navigate to="/planner" replace />
              </AuthRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
