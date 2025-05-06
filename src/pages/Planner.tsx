
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  Heart, 
  Target, 
  FolderKanban, 
  BookOpen, 
  ChartBarBig, 
  Sparkles, 
  Search,
  Plus
} from "lucide-react";
import TaskCalendarView from '@/components/tasks/TaskCalendarView';
import GenieFeatureCard from '@/components/dashboard/GenieFeatureCard';
import { motion } from 'framer-motion';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';
import CreateInternshipDialog from '@/components/internship/CreateInternshipDialog';
import InternshipsList from '@/components/internship/InternshipsList';
import { supabase } from '@/integrations/supabase/client';

const Planner = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState({
    internships: 0,
    habits: 0,
    projects: 0,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const userId = session.user.id;

      // Fetch internships count
      const { count: internshipsCount, error: internshipsError } = await supabase
        .from('internships')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (internshipsError) throw internshipsError;

      // Fetch habits count (assuming habits table exists)
      const { count: habitsCount, error: habitsError } = await supabase
        .from('habits')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (habitsError && habitsError.code !== 'PGRST116') {
        // PGRST116 is "relation does not exist" which we might get if the table doesn't exist yet
        throw habitsError;
      }

      // Fetch projects count (assuming projects table exists)
      const { count: projectsCount, error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      if (projectsError && projectsError.code !== 'PGRST116') {
        throw projectsError;
      }

      setUserData({
        internships: internshipsCount || 0,
        habits: habitsCount || 0,
        projects: projectsCount || 0,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Planner</h1>
            <p className="text-muted-foreground">
              Plan, track, and optimize your activities
            </p>
          </div>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full h-auto gap-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <ChartBarBig className="h-4 w-4" /> 
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="internship" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> 
              <span className="hidden md:inline">Internships</span>
            </TabsTrigger>
            <TabsTrigger value="habits" className="flex items-center gap-2">
              <Heart className="h-4 w-4" /> 
              <span className="hidden md:inline">Habits</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4" /> 
              <span className="hidden md:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> 
              <span className="hidden md:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> 
              <span className="hidden md:inline">Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="procrastination" className="flex items-center gap-2">
              <Search className="h-4 w-4" /> 
              <span className="hidden md:inline">Procrastination</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-focusflow-purple" /> 
                        Goals Summary
                      </CardTitle>
                      <CardDescription>Track your progress across all areas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Internship Applications</span>
                          <span className="font-medium">{userData.internships}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Daily Habits</span>
                          <span className="font-medium">{userData.habits}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Active Projects</span>
                          <span className="font-medium">{userData.projects}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FolderKanban className="h-5 w-5 text-focusflow-purple" /> 
                        Active Projects
                      </CardTitle>
                      <CardDescription>Your ongoing projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span>Final Thesis</span>
                          <span className="text-amber-500 font-medium">In Progress</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Career Fair Prep</span>
                          <span className="text-green-500 font-medium">On Track</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Portfolio Website</span>
                          <span className="text-red-500 font-medium">Delayed</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="md:col-span-2 lg:col-span-1"
                >
                  <GenieFeatureCard />
                </motion.div>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar View</CardTitle>
                    <CardDescription>Your scheduled tasks and events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TaskCalendarView />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="internship" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" /> Internship Progress
                    </CardTitle>
                    <CardDescription>Track your internship applications and progress</CardDescription>
                  </div>
                  <CreateInternshipDialog 
                    onInternshipCreated={() => fetchUserData()}
                  />
                </CardHeader>
                <CardContent>
                  <InternshipsList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="habits" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Heart className="h-5 w-5" /> Daily Habits
                    </CardTitle>
                    <CardDescription>Build and maintain productive routines</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" /> Add Habit
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      Track your daily habits and build consistent routines.
                    </p>
                    <div className="mt-4">
                      <Button variant="outline">
                        <Plus className="mr-1 h-4 w-4" /> Start Adding Habits
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <FolderKanban className="h-5 w-5" /> Project Tracking
                    </CardTitle>
                    <CardDescription>Monitor the progress of your projects</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" /> New Project
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      Track your projects and organize them by priority and deadline.
                    </p>
                    <div className="mt-4">
                      <Button variant="outline">
                        <Plus className="mr-1 h-4 w-4" /> Create Your First Project
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="mt-0">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BookOpen className="h-5 w-5" /> Notes
                    </CardTitle>
                    <CardDescription>Organize your notes and thoughts</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" /> Add Note
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      Create and organize notes for your studies, projects, and ideas.
                    </p>
                    <div className="mt-4">
                      <Button variant="outline">
                        <Plus className="mr-1 h-4 w-4" /> Create Your First Note
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5" /> Personalized Recommendations
                  </CardTitle>
                  <CardDescription>Get AI-powered suggestions to optimize your productivity</CardDescription>
                </CardHeader>
                <CardContent>
                  <GenieFeatureCard />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="procrastination" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Search className="h-5 w-5" /> Procrastination Analysis
                  </CardTitle>
                  <CardDescription>Identify patterns and optimize your time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      The procrastination analyzer will help you identify patterns in your work habits
                      and suggest ways to optimize your productivity.
                    </p>
                    <div className="mt-4 space-y-4">
                      <p>To use this feature, you'll need to:</p>
                      <ol className="list-decimal list-inside text-left max-w-md mx-auto space-y-2">
                        <li>Track your productivity sessions</li>
                        <li>Log your distractions and breaks</li>
                        <li>Use the pomodoro timer regularly</li>
                      </ol>
                      <div className="mt-6">
                        <Button>
                          <Sparkles className="mr-1 h-4 w-4" /> Analyze My Productivity
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Planner;
