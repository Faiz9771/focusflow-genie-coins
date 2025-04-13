
import React, { useState } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import TaskList from '@/components/tasks/TaskList';
import TaskAnalytics from '@/components/tasks/TaskAnalytics';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Brain, Calendar as CalendarIcon, ListTodo, BarChart4 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTaskAnalytics } from '@/services/taskService';

const Tasks = () => {
  const [activeView, setActiveView] = useState<string>("list");
  const analyticsData = getTaskAnalytics();
  
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Task Manager</h1>
            <p className="text-muted-foreground">
              Organize, prioritize and track your tasks
            </p>
          </div>
          
          <CreateTaskDialog 
            trigger={
              <Button className="mt-2 md:mt-0">
                <Plus className="mr-1 h-4 w-4" />
                Create New Task
              </Button>
            }
          />
        </div>

        <Tabs defaultValue="list" value={activeView} onValueChange={setActiveView} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list" className="flex items-center gap-1.5">
              <ListTodo className="h-4 w-4" />
              <span>Task List</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1.5">
              <BarChart4 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <TaskList />
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-500" />
                        Adaptive Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="bg-secondary/70 rounded-md p-3 space-y-2 border">
                          <h3 className="font-medium text-sm">Peak Focus Time</h3>
                          <p className="text-sm text-muted-foreground">
                            Based on your work patterns, schedule challenging tasks between
                            <span className="font-semibold text-purple-600"> 9AM - 11AM </span>
                            for optimal productivity.
                          </p>
                        </div>
                        
                        <div className="bg-secondary/70 rounded-md p-3 space-y-2 border">
                          <h3 className="font-medium text-sm">Procrastination Pattern Detected</h3>
                          <p className="text-sm text-muted-foreground">
                            You tend to delay academic tasks until late evening. Try tackling them 
                            earlier in the day after a short break.
                          </p>
                        </div>
                        
                        <div className="bg-secondary/70 rounded-md p-3 space-y-2 border">
                          <h3 className="font-medium text-sm">Suggested Pomodoro Timing</h3>
                          <p className="text-sm text-muted-foreground">
                            For your current task style, try 25-minute work sessions with 7-minute breaks
                            for maximum efficiency.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Task Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Tasks completed today</span>
                          <span className="text-sm font-bold">3</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Tasks pending</span>
                          <span className="text-sm font-bold">5</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">High priority tasks</span>
                          <span className="text-sm font-bold">2</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TaskAnalytics stats={analyticsData} />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Productivity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 bg-secondary/50 rounded-md border">
                    <p className="text-sm text-muted-foreground">
                      Productivity chart visualization would render here
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Task Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64 bg-secondary/50 rounded-md border">
                    <p className="text-sm text-muted-foreground">
                      Task category and priority distribution charts would render here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-96 bg-secondary/50 rounded-md border">
                  <p className="text-sm text-muted-foreground">
                    Task calendar view would render here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Tasks;
