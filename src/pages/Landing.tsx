
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, ArrowRight, CheckCircle, Award, Clock } from 'lucide-react';

const Landing = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const features = [
    { 
      icon: <CheckCircle className="h-6 w-6 text-green-500" />, 
      title: "Task Management", 
      description: "Organize your tasks and track your progress effortlessly." 
    },
    { 
      icon: <Award className="h-6 w-6 text-amber-500" />, 
      title: "Reward System", 
      description: "Earn coins and unlock rewards for your achievements." 
    },
    { 
      icon: <Clock className="h-6 w-6 text-blue-500" />, 
      title: "Streak Tracking", 
      description: "Build habits with daily streaks and milestones." 
    },
    { 
      icon: <Sparkles className="h-6 w-6 text-purple-500" />, 
      title: "Cute Interface", 
      description: "Enjoy a delightful and motivating user experience." 
    }
  ];

  // Floating bubbles animation
  const bubbles = Array.from({ length: 15 }, (_, i) => i);

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Animated background bubbles */}
      {bubbles.map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-focusflow-purple-light/30 to-focusflow-blue-light/30"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.8 + 0.3 
          }}
          animate={{ 
            y: [null, Math.random() * -300, null],
            x: [null, Math.random() * 100 - 50, null],
          }}
          transition={{ 
            duration: Math.random() * 10 + 20, 
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
          style={{ 
            width: `${Math.random() * 180 + 80}px`,
            height: `${Math.random() * 180 + 80}px`,
            filter: "blur(2px)"
          }}
        />
      ))}

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-20 flex flex-col items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 mb-4">
            Welcome to Wyrd
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Your adorable productivity companion that makes getting things done fun and rewarding
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          {session ? (
            <Button 
              onClick={() => navigate('/')}
              size="lg" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white gap-2"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => navigate('/auth')}
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Get Started
              </Button>
              <Button 
                onClick={() => navigate('/auth')}
                variant="outline" 
                size="lg"
                className="border-purple-300 hover:bg-purple-50"
              >
                Sign In
              </Button>
            </>
          )}
        </motion.div>

        {/* Features */}
        <div className="w-full max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl font-bold text-center mb-8 text-purple-800"
          >
            Why You'll Love Wyrd
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full backdrop-blur-sm bg-white/70 border-white/20 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-purple-100 p-3">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-900">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative w-full py-6 mt-20 text-center text-sm text-gray-500 z-10">
        <p>© 2025 Wyrd. Your cute productivity companion.</p>
      </div>
    </div>
  );
};

export default Landing;
