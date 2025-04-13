
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AuthNav = () => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/auth">Sign In</Link>
      </Button>
      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white" asChild>
        <Link to="/auth?tab=signup">Sign Up</Link>
      </Button>
    </div>
  );
};

export default AuthNav;
