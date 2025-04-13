
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthNav = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth');
  };

  const handleSignUpClick = () => {
    navigate('/auth?tab=signup');
  };

  const checkAuthStatus = async () => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  };

  const handleAuthClick = async (type: 'login' | 'signup') => {
    const isAuthenticated = await checkAuthStatus();
    if (isAuthenticated) {
      navigate('/tasks');
    } else {
      if (type === 'login') {
        handleLoginClick();
      } else {
        handleSignUpClick();
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-700 hover:text-purple-600 hover:bg-purple-50" 
          onClick={() => handleAuthClick('login')}
        >
          Login
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button 
          size="sm" 
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" 
          onClick={() => handleAuthClick('signup')}
        >
          Sign Up
        </Button>
      </motion.div>
    </div>
  );
};

export default AuthNav;
