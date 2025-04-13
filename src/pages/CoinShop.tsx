
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { getCoinBalance, spendCoins } from '@/lib/coinSystem';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Sparkles, Palette, Zap, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ElementType;
  category: 'template' | 'feature' | 'boost';
}

const shopItems: ShopItem[] = [
  {
    id: 'template1',
    name: 'Minimalist Calendar Template',
    description: 'Clean, distraction-free calendar layout for optimal focus',
    price: 50,
    icon: Palette,
    category: 'template'
  },
  {
    id: 'template2',
    name: 'Productivity Journal Template',
    description: 'Track daily achievements with this beautiful template',
    price: 60,
    icon: Palette,
    category: 'template'
  },
  {
    id: 'feature1',
    name: 'Genie Assistant (1 use)',
    description: 'Let our AI Genie organize your tasks and suggest optimal schedules',
    price: 5,
    icon: Sparkles,
    category: 'feature'
  },
  {
    id: 'boost1',
    name: 'Double Coins (24 hours)',
    description: 'Earn twice as many coins for completed tasks for 24 hours',
    price: 100,
    icon: Zap,
    category: 'boost'
  },
  {
    id: 'boost2',
    name: 'Weekly Streak Protector',
    description: 'Preserve your streak even if you miss a day this week',
    price: 75,
    icon: Award,
    category: 'boost'
  }
];

const CoinShop = () => {
  const [coinBalance, setCoinBalance] = useState(getCoinBalance());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredItems = selectedCategory 
    ? shopItems.filter(item => item.category === selectedCategory)
    : shopItems;
    
  const handlePurchase = (item: ShopItem) => {
    if (spendCoins(item.price, item.name)) {
      // In a real app, we would activate the purchased item here
      setCoinBalance(getCoinBalance());
    }
  };
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Coin Shop</h1>
            <p className="text-muted-foreground">
              Spend your hard-earned coins on templates, features, and boosts
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0 bg-secondary p-2 px-4 rounded-lg">
            <Coins className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold text-lg">{coinBalance}</span>
            <span className="text-muted-foreground">coins available</span>
          </div>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 pb-2">
          <Button 
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Items
          </Button>
          <Button 
            variant={selectedCategory === 'template' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory('template')}
          >
            Templates
          </Button>
          <Button 
            variant={selectedCategory === 'feature' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory('feature')}
          >
            Features
          </Button>
          <Button 
            variant={selectedCategory === 'boost' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory('boost')}
          >
            Boosts
          </Button>
        </div>
        
        {/* Shop Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full hover-scale">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        item.category === 'template' ? "bg-blue-100 text-blue-600" :
                        item.category === 'feature' ? "bg-purple-100 text-purple-600" :
                        "bg-green-100 text-green-600"
                      }
                    >
                      {item.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2">
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{item.price}</span>
                    </div>
                    <Button 
                      onClick={() => handlePurchase(item)}
                      disabled={coinBalance < item.price}
                      variant={coinBalance >= item.price ? "default" : "outline"}
                      size="sm"
                    >
                      {coinBalance >= item.price ? "Purchase" : "Not enough coins"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default CoinShop;
