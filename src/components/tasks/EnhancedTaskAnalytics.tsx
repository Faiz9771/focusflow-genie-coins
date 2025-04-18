
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Clock, 
  Brain, 
  Zap, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  LineChart,
  PieChart,
  BarChart2,
  Loader2,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { fetchTaskAnalytics, getTaskAnalytics } from '@/services/taskService';

// Using recharts for data visualization
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';

const COLORS = ['#4f46e5', '#06b6d4', '#8b5cf6', '#10b981', '#f97316'];

const EnhancedTaskAnalytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Use mock data as fallback
  const mockStats = getTaskAnalytics();
  
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      const data = await fetchTaskAnalytics();
      setAnalyticsData(data);
      setLoading(false);
    };
    
    loadAnalyticsData();
  }, []);
  
  // Example category completion data for the pie chart
  const categoryData = [
    { name: 'Academic', value: 12 },
    { name: 'Work', value: 8 },
    { name: 'Personal', value: 5 },
  ];
  
  // Example time series data for the line chart
  const weeklyCompletionData = [
    { name: 'Mon', completed: 3, total: 5 },
    { name: 'Tue', completed: 4, total: 6 },
    { name: 'Wed', completed: 2, total: 7 },
    { name: 'Thu', completed: 5, total: 8 },
    { name: 'Fri', completed: 4, total: 5 },
    { name: 'Sat', completed: 2, total: 3 },
    { name: 'Sun', completed: 1, total: 4 },
  ];
  
  // Example focus time data for the bar chart
  const focusTimeData = [
    { name: 'Morning', hours: 4.5 },
    { name: 'Afternoon', hours: 3.2 },
    { name: 'Evening', hours: 2.8 },
    { name: 'Night', hours: 2.0 },
  ];
  
  if (loading) {
    return (
      <Card className="h-full min-h-[400px]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading analytics data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-1.5">
            <BarChart className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="completion" className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>Completion Rate</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-1.5">
            <PieChart className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger value="focus" className="flex items-center gap-1.5">
            <Brain className="h-4 w-4" />
            <span>Focus Time</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-purple-500" />
                  Productivity Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Productivity Score</span>
                    <span className="font-semibold">{mockStats.productivityScore}%</span>
                  </div>
                  <Progress value={mockStats.productivityScore} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      Focus Time
                    </h4>
                    <p className="text-2xl font-bold">{mockStats.focusTime} hrs</p>
                    <p className="text-xs text-muted-foreground">Tracked this week</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4 text-emerald-500" />
                      Task Completion
                    </h4>
                    <p className="text-2xl font-bold">{mockStats.taskCompletionRate}%</p>
                    <p className="text-xs text-muted-foreground">Of tasks completed on time</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Productivity Insights</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <h5 className="text-xs font-medium">Peak Hours</h5>
                      </div>
                      <p className="text-sm font-semibold">{mockStats.peakHours}</p>
                    </div>
                    
                    <div className="bg-secondary rounded-md p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <h5 className="text-xs font-medium">Best Category</h5>
                      </div>
                      <p className="text-sm font-semibold capitalize">{mockStats.mostProductiveCategory}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Status</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: 24 },
                        { name: 'In Progress', value: 8 },
                        { name: 'Pending', value: 15 },
                        { name: 'Overdue', value: 3 }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'Completed', value: 24, color: '#10b981' },
                        { name: 'In Progress', value: 8, color: '#6366f1' },
                        { name: 'Pending', value: 15, color: '#f59e0b' },
                        { name: 'Overdue', value: 3, color: '#ef4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Task Completion</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={weeklyCompletionData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      name="Total Tasks"
                      dataKey="total" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      name="Completed Tasks"
                      dataKey="completed" 
                      stroke="#82ca9d" 
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="completion">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Completion Trend</CardTitle>
                <CardDescription>Task completion rate over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={[
                      { name: 'Week 1', onTime: 65, late: 20, abandoned: 15 },
                      { name: 'Week 2', onTime: 72, late: 18, abandoned: 10 },
                      { name: 'Week 3', onTime: 68, late: 22, abandoned: 10 },
                      { name: 'Week 4', onTime: 85, late: 10, abandoned: 5 },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="onTime" stackId="a" name="On Time" fill="#10b981" />
                    <Bar dataKey="late" stackId="a" name="Late" fill="#f59e0b" />
                    <Bar dataKey="abandoned" stackId="a" name="Abandoned" fill="#ef4444" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Completion Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">On-time completion</h4>
                      <div className="flex items-center gap-1 text-green-500">
                        <ArrowUp className="h-3 w-3" />
                        <span className="text-xs font-medium">12%</span>
                      </div>
                    </div>
                    <Progress value={85} className="h-2 bg-muted" />
                    <p className="text-xs text-muted-foreground text-right">85% of tasks</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Late completion</h4>
                      <div className="flex items-center gap-1 text-red-500">
                        <ArrowDown className="h-3 w-3" />
                        <span className="text-xs font-medium">5%</span>
                      </div>
                    </div>
                    <Progress value={10} className="h-2 bg-muted" />
                    <p className="text-xs text-muted-foreground text-right">10% of tasks</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Abandoned tasks</h4>
                    <Progress value={5} className="h-2 bg-muted" />
                    <p className="text-xs text-muted-foreground text-right">5% of tasks</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Time allocation</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-purple-500" />
                          <span className="text-sm">Academic</span>
                        </div>
                        <span className="text-sm font-medium">48%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="text-sm">Work</span>
                        </div>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                          <span className="text-sm">Personal</span>
                        </div>
                        <span className="text-sm font-medium">17%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tasks by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Priority Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={[
                      { name: 'High', academic: 4, work: 5, personal: 2 },
                      { name: 'Medium', academic: 5, work: 2, personal: 3 },
                      { name: 'Low', academic: 3, work: 1, personal: 5 },
                    ]}
                    layout="vertical"
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="academic" name="Academic" fill="#8884d8" />
                    <Bar dataKey="work" name="Work" fill="#82ca9d" />
                    <Bar dataKey="personal" name="Personal" fill="#ffc658" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Category Performance</CardTitle>
                <CardDescription>Completion rate by category over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={[
                      { name: 'Week 1', academic: 72, work: 65, personal: 80 },
                      { name: 'Week 2', academic: 75, work: 68, personal: 78 },
                      { name: 'Week 3', academic: 80, work: 75, personal: 85 },
                      { name: 'Week 4', academic: 85, work: 78, personal: 88 },
                      { name: 'Week 5', academic: 87, work: 80, personal: 90 },
                    ]}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="academic" name="Academic" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="work" name="Work" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="personal" name="Personal" stroke="#ffc658" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="focus">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Focus Hours</CardTitle>
                <CardDescription>When you're most productive</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={focusTimeData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" name="Focus Hours" fill="#8884d8" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Energy Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Morning (6AM-12PM)</h4>
                    <Progress value={85} className="h-2 bg-muted" />
                    <p className="text-xs text-muted-foreground text-right">High energy</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Afternoon (12PM-5PM)</h4>
                    <Progress value={65} className="h-2 bg-muted" />
                    <p className="text-xs text-muted-foreground text-right">Medium energy</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Evening (5PM-9PM)</h4>
                    <Progress value={75} className="h-2 bg-muted" />
                    <p className="text-xs text-muted-foreground text-right">Medium-high energy</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Night (9PM-6AM)</h4>
                    <Progress value={40} className="h-2 bg-muted" />
                    <p className="text-xs text-muted-foreground text-right">Low energy</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Focus Recommendations</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500 shrink-0" />
                        <span>Schedule complex tasks during morning hours</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500 shrink-0" />
                        <span>Take breaks between 2-4PM when focus drops</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500 shrink-0" />
                        <span>Use evening hours for creative tasks</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg">Procrastination Patterns</CardTitle>
                <CardDescription>Insights to help you overcome procrastination</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStats.procrastinationPatterns.map((pattern, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-secondary rounded-md">
                      <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm">{pattern}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {index === 0 && "Try working on these tasks earlier in the day after a short break."}
                          {index === 1 && "Consider breaking large tasks into smaller, more manageable subtasks."}
                          {index === 2 && "Plan your Sunday schedule ahead of time with specific time blocks."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedTaskAnalytics;
