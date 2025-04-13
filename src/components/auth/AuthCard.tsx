
import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

interface AuthCardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  handleSignIn: (e: React.FormEvent) => Promise<void>;
  handleSignUp: (e: React.FormEvent) => Promise<void>;
}

const AuthCard: React.FC<AuthCardProps> = ({
  activeTab,
  setActiveTab,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  handleSignIn,
  handleSignUp
}) => {
  return (
    <Card className="backdrop-blur-md bg-white/80 border-white/20 shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <Sparkles className={`h-8 w-8 ${
              activeTab === 'signin' 
                ? 'text-blue-500' 
                : 'text-amber-500'
            }`} />
          </motion.div>
        </div>
        <CardTitle className={`text-3xl font-bold transition-colors duration-300 ${
          activeTab === 'signin' 
            ? 'text-blue-700' 
            : 'text-amber-700'
        }`}>
          Wyrd
        </CardTitle>
        <CardDescription className="text-base">
          Your cute productivity companion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue={activeTab} 
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <SignInForm 
              email={email}
              password={password}
              loading={loading}
              setEmail={setEmail}
              setPassword={setPassword}
              handleSignIn={handleSignIn}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm 
              email={email}
              password={password}
              loading={loading}
              setEmail={setEmail}
              setPassword={setPassword}
              handleSignUp={handleSignUp}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuthCard;
