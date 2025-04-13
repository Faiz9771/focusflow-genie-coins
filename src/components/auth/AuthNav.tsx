
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const AuthNav = () => {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button variant="ghost" size="sm" className="text-gray-700 hover:text-purple-600 hover:bg-purple-50" asChild>
          <Link to="/auth">Login</Link>
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
          asChild
        >
          <Link to="/auth?tab=signup">Sign Up</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default AuthNav;
