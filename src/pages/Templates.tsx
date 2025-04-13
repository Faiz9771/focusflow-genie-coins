
import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutTemplate, Star, Clock, Palette, Check, BookOpen, Briefcase, Users, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'academic' | 'work' | 'personal';
  popular: boolean;
  premium: boolean;
  icon: React.ReactNode;
}

const templates: Template[] = [
  {
    id: "1",
    name: "Study Planner",
    description: "Track study sessions with pomodoro timers and subject categorization",
    category: "academic",
    popular: true,
    premium: false,
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    id: "2",
    name: "Project Kanban",
    description: "Organize group projects with kanban boards and task assignments",
    category: "work",
    popular: true,
    premium: false,
    icon: <Briefcase className="h-5 w-5" />
  },
  {
    id: "3",
    name: "Weekly Schedule",
    description: "Plan your week with time blocks and recurring events",
    category: "personal",
    popular: false,
    premium: false,
    icon: <Clock className="h-5 w-5" />
  },
  {
    id: "4",
    name: "Research Tracker",
    description: "Organize research papers, notes and bibliography",
    category: "academic",
    popular: false,
    premium: false,
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    id: "5",
    name: "Internship Journal",
    description: "Document your internship experience and track goals",
    category: "work",
    popular: false,
    premium: true,
    icon: <Briefcase className="h-5 w-5" />
  },
  {
    id: "6",
    name: "Habit Builder",
    description: "Create and track daily habits with streaks and reminders",
    category: "personal",
    popular: true,
    premium: true,
    icon: <Heart className="h-5 w-5" />
  },
  {
    id: "7",
    name: "Group Study Planner",
    description: "Coordinate study sessions with friends and track progress",
    category: "academic",
    popular: false,
    premium: true,
    icon: <Users className="h-5 w-5" />
  },
  {
    id: "8", 
    name: "Custom Journal",
    description: "Design your own journal template with customizable sections",
    category: "personal",
    popular: false,
    premium: true,
    icon: <Palette className="h-5 w-5" />
  }
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case "academic":
      return "bg-blue-100 text-blue-600";
    case "personal":
      return "bg-purple-100 text-purple-600";
    case "work":
      return "bg-emerald-100 text-emerald-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const TemplateCard = ({ template }: { template: Template }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="h-full hover-scale">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            {template.icon}
          </div>
          <div className="flex gap-2">
            {template.popular && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-600 border-0">
                <Star className="h-3 w-3 mr-1" /> Popular
              </Badge>
            )}
            {template.premium && (
              <Badge variant="secondary" className="bg-focusflow-purple/20 text-focusflow-purple border-0">
                Premium
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg mt-2">{template.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </CardHeader>
      <CardFooter className="pt-2">
        <div className="w-full flex justify-between items-center">
          <Badge variant="outline" className={getCategoryColor(template.category)}>
            {template.category}
          </Badge>
          <Button size="sm" variant={template.premium ? "outline" : "default"}>
            {template.premium ? "Unlock" : "Use Template"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  </motion.div>
);

const Templates = () => {
  const [filter, setFilter] = React.useState<string | null>(null);
  
  const filteredTemplates = filter 
    ? templates.filter(template => template.category === filter)
    : templates;
    
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
            <p className="text-muted-foreground">
              Ready-made templates to boost your productivity
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 pb-2">
          <Button 
            variant={filter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(null)}
          >
            All Templates
          </Button>
          <Button 
            variant={filter === 'academic' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('academic')}
          >
            Academic
          </Button>
          <Button 
            variant={filter === 'work' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('work')}
          >
            Work
          </Button>
          <Button 
            variant={filter === 'personal' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('personal')}
          >
            Personal
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTemplates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Templates;
