
import React from 'react';
import { motion } from "framer-motion";
import { Coffee, Clock, Star, CheckSquare, Zap, BookOpen } from "lucide-react";

interface AuthBackgroundProps {
  activeTab: string;
}

const AuthBackground: React.FC<AuthBackgroundProps> = ({ activeTab }) => {
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
  );
};

export default AuthBackground;
