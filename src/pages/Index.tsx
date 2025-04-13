
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import DashboardGreeting from '@/components/dashboard/DashboardGreeting';
import TaskList from '@/components/tasks/TaskList';
import StreakCard from '@/components/dashboard/StreakCard';
import CoinsCard from '@/components/dashboard/CoinsCard';
import TaskSummaryCard from '@/components/dashboard/TaskSummaryCard';
import GenieFeatureCard from '@/components/dashboard/GenieFeatureCard';
import CoinRewardCard from '@/components/dashboard/CoinRewardCard';
import MotivationalQuote from '@/components/motivation/MotivationalQuote';
import StreakChallengeCard from '@/components/challenges/StreakChallengeCard';

const Index = () => {
  return (
    <MainLayout>
      <DashboardGreeting />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content - Task list */}
        <div className="md:col-span-2 space-y-6">
          <TaskList />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MotivationalQuote />
            <GenieFeatureCard />
          </div>
        </div>
        
        {/* Sidebar widgets */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-4">
            <TaskSummaryCard />
            <StreakCard />
            <CoinsCard />
          </div>
          <StreakChallengeCard />
          <CoinRewardCard />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
