
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface SignUpFormProps {
  email: string;
  password: string;
  loading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  email,
  password,
  loading,
  setEmail,
  setPassword,
  handleSignUp
}) => {
  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <Label htmlFor="signup-email">Email</Label>
        <Input 
          id="signup-email" 
          type="email" 
          placeholder="your@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-amber-200 focus:border-amber-400"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="space-y-2"
      >
        <Label htmlFor="signup-password">Password</Label>
        <Input 
          id="signup-password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-amber-200 focus:border-amber-400"
        />
        <p className="text-xs text-muted-foreground">
          Password must be at least 6 characters
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Button
          type="submit"
          className="w-full mt-2 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 text-white"
          disabled={loading}
        >
          {loading ? (
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mr-2"
            >
              <Star className="h-4 w-4" />
            </motion.div>
          ) : null}
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-500">Stop procrastinating, start being productive!</p>
      </motion.div>
    </form>
  );
};

export default SignUpForm;
