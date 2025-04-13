
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Award, 
  Clock, 
  Star,
  Calendar,
  Clipboard,
  Lightbulb
} from 'lucide-react';

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

  const testimonials = [
    {
      name: "Alex Chen",
      role: "Student",
      comment: "Wyrd helped me stay on track with my study schedule. The rewards keep me motivated!",
      avatar: "A",
      color: "bg-pink-100"
    },
    {
      name: "Jamie Lee",
      role: "Designer",
      comment: "I love how cute everything is! Makes productivity feel less like a chore.",
      avatar: "J",
      color: "bg-purple-100"
    },
    {
      name: "Sam Taylor",
      role: "Developer",
      comment: "The streak system helps me maintain consistent coding practice every day.",
      avatar: "S",
      color: "bg-blue-100"
    }
  ];

  // Floating bubbles animation
  const bubbles = Array.from({ length: 20 }, (_, i) => i);

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

      {/* Navigation */}
      <header className="relative z-10 w-full px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 text-purple-600 mr-2" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">Wyrd</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">Features</a>
            <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition-colors">Testimonials</a>
            <a href="#faq" className="text-gray-700 hover:text-purple-600 transition-colors">FAQ</a>
          </nav>
          {session ? (
            <Button 
              onClick={() => navigate('/')}
              size="sm" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Dashboard
            </Button>
          ) : (
            <Button 
              onClick={() => navigate('/auth')}
              size="sm" 
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative container mx-auto px-4 py-20 flex flex-col items-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">Increase Productivity</span>
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            To Done All The Tasks <span className="text-amber-500">Instantly</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
            Wyrd is built for everyone who wants to stay productive, track tasks, and earn rewards while doing it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center mb-16"
        >
          <Button 
            onClick={() => navigate('/auth?tab=signup')}
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white gap-2"
          >
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Button>
          {!session && (
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline" 
              size="lg"
              className="border-purple-300 hover:bg-purple-50"
            >
              Sign In
            </Button>
          )}
        </motion.div>

        {/* Feature Highlight */}
        <div className="w-full max-w-4xl py-16" id="features">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12 text-purple-800"
          >
            Boost Productivity Everyday
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <div className="space-y-10">
              {/* Feature item 1 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Task Time Planning</h3>
                  <p className="text-gray-600 mt-2">
                    Plan your tasks effectively with our intuitive interface and time tracking features.
                  </p>
                </div>
              </motion.div>
              
              {/* Feature item 2 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Clipboard className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Customizable Views</h3>
                  <p className="text-gray-600 mt-2">
                    Organize your workspace the way you want with multiple view options.
                  </p>
                </div>
              </motion.div>
              
              {/* Feature item 3 */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Smart Suggestions</h3>
                  <p className="text-gray-600 mt-2">
                    Get personalized productivity tips based on your work patterns.
                  </p>
                </div>
              </motion.div>
            </div>
            
            {/* Feature showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-r from-orange-400 to-amber-300 rounded-lg p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-amber-500" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Daily Progress</h4>
                    <p className="text-xs text-white/80">10 April 2025</p>
                  </div>
                </div>
                
                {/* Mock content blocks */}
                <div className="space-y-3">
                  <div className="h-4 bg-white/30 rounded w-3/4"></div>
                  <div className="h-4 bg-white/30 rounded"></div>
                  <div className="h-4 bg-white/30 rounded w-5/6"></div>
                  <div className="h-4 bg-white/30 rounded w-1/2"></div>
                </div>
              </div>
              
              {/* Floating element */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4"
              >
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  <span className="font-medium">3-Day Streak!</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
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
        
        {/* Testimonials */}
        <div className="w-full max-w-4xl py-20" id="testimonials">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12 text-purple-800"
          >
            Users Love Wyrd
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                viewport={{ once: true }}
                className="backdrop-blur-sm bg-white/70 p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full ${testimonial.color} flex items-center justify-center font-semibold text-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="w-full max-w-4xl py-16" id="faq">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-10 text-purple-800"
          >
            Frequently Asked Questions
          </motion.h2>
          
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md"
            >
              <h3 className="font-semibold text-lg text-purple-900 mb-2">How do I earn coins?</h3>
              <p className="text-gray-600">You earn coins by completing tasks, maintaining streaks, and achieving milestones in your productivity journey.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md"
            >
              <h3 className="font-semibold text-lg text-purple-900 mb-2">Can I use Wyrd on my mobile device?</h3>
              <p className="text-gray-600">Yes! Wyrd works on any device with a web browser, and we're working on dedicated mobile apps too.</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md"
            >
              <h3 className="font-semibold text-lg text-purple-900 mb-2">Is there a free version available?</h3>
              <p className="text-gray-600">We offer a free 30-day trial with full access to all features. After that, you can choose a subscription plan that fits your needs.</p>
            </motion.div>
          </div>
        </div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full max-w-4xl py-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to boost your productivity?</h2>
          <p className="text-lg text-gray-700 mb-8">Join thousands of users and start your journey with Wyrd today!</p>
          <Button 
            onClick={() => navigate('/auth?tab=signup')}
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white gap-2"
          >
            Start Free Trial <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative w-full py-6 text-center text-sm text-gray-500 z-10">
        <p>© 2025 Wyrd. Your cute productivity companion.</p>
      </div>
    </div>
  );
};

export default Landing;
