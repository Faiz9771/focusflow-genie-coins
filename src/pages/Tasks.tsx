
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import TaskList from '@/components/tasks/TaskList';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const Tasks = () => {
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
          
          <Button className="mt-2 md:mt-0" size="sm">
            <Plus className="mr-1 h-4 w-4" />
            Create New Task
          </Button>
        </div>

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
                <CardHeader>
                  <CardTitle className="text-lg">Task Statistics</CardTitle>
                </CardHeader>
                <div className="p-6 pt-0">
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
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Tasks;
