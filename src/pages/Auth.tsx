
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Sparkles, Coffee, Zap, Clock, Laptop, BookOpen, Star, CheckSquare } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const defaultTab = urlParams.get('tab') === 'signup' ? 'signup' : 'signin';
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) navigate('/');
    });

    // Set up auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) navigate('/');
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Sign up successful!', { 
        description: 'Please check your email for verification.'
      });
    } catch (error) {
      toast.error('Sign up error', { 
        description: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Welcome back!');
    } catch (error) {
      toast.error('Login failed', { 
        description: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  // Productivity-themed elements for Sign In
  const productivityElements = Array.from({ length: 8 }, (_, i) => i);
  
  // Procrastination-themed elements for Sign Up
  const procrastinationElements = Array.from({ length: 8 }, (_, i) => i);

  const procrastinationIcons = [
    <Coffee key="coffee" className="w-full h-full text-amber-400" />,
    <Clock key="clock" className="w-full h-full text-red-400" />,
    <Star key="star" className="w-full h-full text-yellow-400" />
  ];
  
  const productivityIcons = [
    <CheckSquare key="check" className="w-full h-full text-green-400" />,
    <Zap key="zap" className="w-full h-full text-blue-400" />,
    <BookOpen key="book" className="w-full h-full text-purple-400" />
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Conditional backgrounds based on active tab */}
      <div className={`fixed inset-0 transition-all duration-700 ${
        activeTab === 'signin' 
          ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50' 
          : 'bg-gradient-to-br from-amber-50 via-red-50 to-orange-50'
      }`}>
        {/* Animated elements for Sign In (productivity themed) */}
        {activeTab === 'signin' && productivityElements.map((i) => (
          <motion.div
            key={`productivity-${i}`}
            className="absolute rounded-lg backdrop-blur-sm bg-white/20 flex items-center justify-center overflow-hidden"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.3 + 0.2,
              opacity: 0
            }}
            animate={{ 
              y: [null, Math.random() * -300, null],
              x: [null, Math.random() * 200 - 100, null],
              rotate: [0, Math.random() * 180],
              opacity: [0, 0.7, 0]
            }}
            transition={{ 
              duration: Math.random() * 15 + 10, 
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
            style={{ 
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
            }}
          >
            {productivityIcons[Math.floor(Math.random() * productivityIcons.length)]}
          </motion.div>
        ))}
        
        {/* Animated elements for Sign Up (procrastination themed) */}
        {activeTab === 'signup' && procrastinationElements.map((i) => (
          <motion.div
            key={`procrastination-${i}`}
            className="absolute rounded-full backdrop-blur-sm bg-white/20 flex items-center justify-center overflow-hidden"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.4 + 0.2,
              opacity: 0
            }}
            animate={{ 
              y: [null, Math.random() * 300, null],
              x: [null, Math.random() * 200 - 100, null],
              rotate: [0, Math.random() * -180],
              opacity: [0, 0.7, 0]
            }}
            transition={{ 
              duration: Math.random() * 18 + 15, 
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror"
            }}
            style={{ 
              width: `${Math.random() * 120 + 50}px`,
              height: `${Math.random() * 120 + 50}px`,
            }}
          >
            {procrastinationIcons[Math.floor(Math.random() * procrastinationIcons.length)]}
          </motion.div>
        ))}

        {/* Additional floating elements */}
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className={`absolute rounded-full ${
              activeTab === 'signin' 
                ? 'bg-blue-100/40' 
                : 'bg-amber-100/40'
            }`}
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.3 + 0.1
            }}
            animate={{ 
              y: [null, Math.random() * -400, null],
              x: [null, Math.random() * 100 - 50, null],
            }}
            transition={{ 
              duration: Math.random() * 20 + 15, 
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror"
            }}
            style={{ 
              width: `${Math.random() * 200 + 30}px`,
              height: `${Math.random() * 200 + 30}px`,
              filter: "blur(4px)"
            }}
          />
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 w-full max-w-md"
      >
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
              defaultValue={defaultTab} 
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
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
                          <Laptop className="h-4 w-4" />
                        </motion.div>
                      ) : null}
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </motion.div>
                </form>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-6 text-center"
                >
                  <p className="text-sm text-gray-500">Get productive right away!</p>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="signup">
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
                          <Coffee className="h-4 w-4" />
                        </motion.div>
                      ) : null}
                      {loading ? 'Signing Up...' : 'Sign Up'}
                    </Button>
                  </motion.div>
                </form>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-6 text-center"
                >
                  <p className="text-sm text-gray-500">Stop procrastinating, start being productive!</p>
                </motion.div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Back to home link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-6"
        >
          <button 
            onClick={() => navigate('/landing')}
            className="text-gray-600 text-sm hover:text-purple-600 transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
