
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FolderKanban,
  Calendar,
  AlertCircle,
  Clock,
  FileEdit,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ProjectStatus = "planning" | "in_progress" | "completed" | "on_hold";
type ProjectPriority = "low" | "medium" | "high";

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string | null;
  due_date: string | null;
  completion_percentage: number;
  created_at: string;
};

const statusColors = {
  planning: "bg-amber-100 text-amber-800 border-amber-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  on_hold: "bg-gray-100 text-gray-800 border-gray-200",
};

const statusLabels = {
  planning: "Planning",
  in_progress: "In Progress",
  completed: "Completed",
  on_hold: "On Hold",
};

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-amber-100 text-amber-800 border-amber-200",
  high: "bg-red-100 text-red-800 border-red-200",
};

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export default function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type casting the project data to ensure it matches our Project type
      const typedData = data?.map(item => ({
        ...item,
        status: item.status as ProjectStatus,
        priority: item.priority as ProjectPriority
      })) || [];
      
      setProjects(typedData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProjects(projects.filter(item => item.id !== id));
      toast.success('Project removed successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-10">
        <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-3" />
        <h3 className="text-lg font-medium">No projects yet</h3>
        <p className="text-muted-foreground mb-4">Start managing your projects by adding your first one</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map(project => (
        <Card key={project.id} className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FolderKanban className="h-4 w-4 text-blue-500" />
                  <h3 className="font-semibold text-lg">{project.title}</h3>
                </div>
                
                {project.description && (
                  <p className="text-sm text-muted-foreground mb-2 mt-1">{project.description}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className={`${statusColors[project.status]}`}>
                    {statusLabels[project.status]}
                  </Badge>
                  <Badge variant="outline" className={`${priorityColors[project.priority]}`}>
                    {priorityLabels[project.priority]}
                  </Badge>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-0 flex flex-col sm:items-end">
                {project.due_date && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Due: {format(new Date(project.due_date), "MMM d, yyyy")}</span>
                  </div>
                )}
                
                <div className="mt-2 w-full sm:w-40">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs">Progress</span>
                    <span className="text-xs font-medium">{project.completion_percentage}%</span>
                  </div>
                  <Progress value={project.completion_percentage} className="h-2" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-red-500 hover:text-red-600" 
                onClick={() => handleDelete(project.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
