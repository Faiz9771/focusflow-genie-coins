
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Brain, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2,
  Lightbulb,
  Timer,
  ListTodo
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface GenieRecommendation {
  highPriorityRecommendations: Array<{
    taskId?: string;
    title?: string;
    priority?: string;
    message: string;
    timeEstimate?: string;
  }>;
  timeManagement: {
    message: string;
    timeBlocks: Array<{
      startTime: string;
      endTime: string;
      activityType: string;
      recommendation: string;
      focusScore?: number;
    }>;
  };
  procrastinationPatterns: Array<{
    type: string;
    message: string;
  }>;
  productivityTips: string[];
  suggestedPomodoro: {
    workDuration: number;
    breakDuration: number;
    explanation: string;
  };
}

interface GenieRecommendationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPomodoroSettings?: (workDuration: number, breakDuration: number) => void;
}

const GenieRecommendationsModal = ({ 
  isOpen, 
  onClose,
  onApplyPomodoroSettings
}: GenieRecommendationsModalProps) => {
  const [activeTab, setActiveTab] = useState("priority");
  const [recommendations, setRecommendations] = useState<GenieRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("You need to be logged in to use Genie");
          onClose();
          return;
        }

        const { data, error } = await supabase.functions.invoke('genie-recommendations', {
          body: { userId: session.user.id }
        });

        if (error) {
          console.error("Error fetching Genie recommendations:", error);
          toast.error("Failed to get Genie recommendations");
          return;
        }

        setRecommendations(data);
      } catch (error) {
        console.error("Error in Genie recommendations:", error);
        toast.error("Something went wrong with Genie");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchRecommendations();
    }
  }, [isOpen, onClose]);

  const handleApplyPomodoroSettings = () => {
    if (recommendations?.suggestedPomodoro && onApplyPomodoroSettings) {
      setApplying(true);
      const { workDuration, breakDuration } = recommendations.suggestedPomodoro;
      
      // Simulate processing
      setTimeout(() => {
        onApplyPomodoroSettings(workDuration, breakDuration);
        toast.success("Applied optimal Pomodoro settings!");
        setApplying(false);
      }, 500);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-gray-900">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-500" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">
              Genie Recommendations
            </span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted-foreground">Generating personalized recommendations...</p>
          </div>
        ) : (
          <div className="py-2">
            {recommendations ? (
              <Tabs defaultValue="priority" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="priority" className="text-xs md:text-sm">
                    <ListTodo className="h-4 w-4 mr-1 hidden md:inline" />
                    Priority
                  </TabsTrigger>
                  <TabsTrigger value="schedule" className="text-xs md:text-sm">
                    <Clock className="h-4 w-4 mr-1 hidden md:inline" />
                    Schedule
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="text-xs md:text-sm">
                    <Brain className="h-4 w-4 mr-1 hidden md:inline" />
                    Insights
                  </TabsTrigger>
                  <TabsTrigger value="pomodoro" className="text-xs md:text-sm">
                    <Timer className="h-4 w-4 mr-1 hidden md:inline" />
                    Pomodoro
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="priority" className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-700 mb-2">Task Priorities</h3>
                  {recommendations.highPriorityRecommendations.map((rec, idx) => (
                    <Card key={idx} className="overflow-hidden border-l-4 border-l-indigo-500">
                      <CardContent className="p-4">
                        {rec.title ? (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{rec.title}</h4>
                              {rec.priority && (
                                <Badge variant="outline" className={
                                  rec.priority === "high" ? "bg-red-100 text-red-700" :
                                  rec.priority === "medium" ? "bg-amber-100 text-amber-700" :
                                  "bg-green-100 text-green-700"
                                }>
                                  {rec.priority}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{rec.message}</p>
                            {rec.timeEstimate && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>Estimated: {rec.timeEstimate}</span>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="text-muted-foreground">{rec.message}</p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
                
                <TabsContent value="schedule" className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-700 mb-2">Optimal Schedule</h3>
                  <p className="text-sm text-muted-foreground mb-4">{recommendations.timeManagement.message}</p>
                  <div className="space-y-3">
                    {recommendations.timeManagement.timeBlocks.map((block, idx) => (
                      <Card key={idx} className={`overflow-hidden ${idx % 2 === 0 ? "bg-indigo-50" : "bg-purple-50"}`}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center mb-2 md:mb-0">
                              <Clock className="h-4 w-4 text-indigo-600 mr-2" />
                              <span className="font-medium">
                                {block.startTime} - {block.endTime}
                              </span>
                            </div>
                            <Badge variant="secondary" className="w-fit">
                              {block.activityType}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {block.recommendation}
                          </p>
                          {block.focusScore && (
                            <div className="mt-2 flex items-center text-xs">
                              <Brain className="h-3 w-3 text-purple-500 mr-1" />
                              <span className="text-purple-600 font-medium">
                                Focus score: {block.focusScore}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="insights" className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-indigo-700 mb-4">Procrastination Patterns</h3>
                    <div className="space-y-3">
                      {recommendations.procrastinationPatterns.map((pattern, idx) => (
                        <Card key={idx} className="overflow-hidden">
                          <CardContent className="p-4 flex items-start">
                            <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 shrink-0" />
                            <div>
                              <h4 className="font-medium mb-1">
                                {pattern.type.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {pattern.message}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-700 mb-4">Productivity Tips</h3>
                    <div className="space-y-3">
                      {recommendations.productivityTips.map((tip, idx) => (
                        <Card key={idx} className="overflow-hidden">
                          <CardContent className="p-4 flex items-start">
                            <Lightbulb className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 shrink-0" />
                            <p className="text-sm">{tip}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="pomodoro" className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-700 mb-2">Optimal Pomodoro Settings</h3>
                  
                  <Card className="overflow-hidden border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                        <div className="flex items-center mb-4 md:mb-0">
                          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                            <Timer className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-lg">Custom Timing</h4>
                            <p className="text-sm text-muted-foreground">Tailored to your work patterns</p>
                          </div>
                        </div>
                        <Button 
                          onClick={handleApplyPomodoroSettings}
                          disabled={applying}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          {applying ? (
                            <>
                              <span className="mr-2">Applying</span>
                              <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Apply Settings
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white bg-opacity-60 rounded-lg p-4 shadow-sm">
                          <h5 className="text-sm font-medium text-indigo-800 mb-1">Work Duration</h5>
                          <div className="text-3xl font-bold text-indigo-700 mb-1">
                            {recommendations.suggestedPomodoro.workDuration} 
                            <span className="text-lg ml-1 font-normal text-indigo-400">min</span>
                          </div>
                        </div>
                        
                        <div className="bg-white bg-opacity-60 rounded-lg p-4 shadow-sm">
                          <h5 className="text-sm font-medium text-indigo-800 mb-1">Break Duration</h5>
                          <div className="text-3xl font-bold text-indigo-700 mb-1">
                            {recommendations.suggestedPomodoro.breakDuration}
                            <span className="text-lg ml-1 font-normal text-indigo-400">min</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 text-sm text-muted-foreground bg-white bg-opacity-60 p-4 rounded-lg">
                        <p>{recommendations.suggestedPomodoro.explanation}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                <p>Failed to generate recommendations. Please try again later.</p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenieRecommendationsModal;
