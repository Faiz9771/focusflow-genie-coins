
import React from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

interface SignInFormProps {
  email: string;
  password: string;
  loading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
}

const SignInForm: React.FC<SignInFormProps> = ({
  email,
  password,
  loading,
  setEmail,
  setPassword,
  handleSignIn
}) => {
  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-2"
      >
        <Label htmlFor="signin-email">Email</Label>
        <Input 
          id="signin-email" 
          type="email" 
          placeholder="your@email.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border-blue-200 focus:border-blue-400"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="space-y-2"
      >
        <Label htmlFor="signin-password">Password</Label>
        <Input 
          id="signin-password" 
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-blue-200 focus:border-blue-400"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Button
          type="submit"
          className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          disabled={loading}
        >
          {loading ? (
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="mr-2"
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
          ) : null}
          {loading ? 'Logging In...' : 'Login'}
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-500">Get productive right away!</p>
      </motion.div>
    </form>
  );
};

export default SignInForm;
