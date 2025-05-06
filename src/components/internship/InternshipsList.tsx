
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase,
  Building,
  Calendar,
  Clock,
  FileEdit,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EditInternshipDialog from './EditInternshipDialog';

const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  applied: "bg-blue-100 text-blue-800 border-blue-200",
  interview: "bg-purple-100 text-purple-800 border-purple-200",
  offer: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  pending: "Pending",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer Received",
  rejected: "Rejected",
};

type InternshipStatus = "pending" | "applied" | "interview" | "offer" | "rejected";

type Internship = {
  id: string;
  company: string;
  position: string;
  status: InternshipStatus;
  application_date: string;
  deadline_date?: string | null;
  notes?: string | null;
}

export default function InternshipsList() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, []);

  async function fetchInternships() {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .eq('user_id', session.user.id)
        .order('application_date', { ascending: false });

      if (error) throw error;
      
      // Type casting the status to ensure it matches our InternshipStatus type
      const typedData = data?.map(item => ({
        ...item,
        status: item.status as InternshipStatus
      })) || [];
      
      setInternships(typedData);
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from('internships')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setInternships(internships.filter(item => item.id !== id));
      toast.success('Internship application removed');
    } catch (error) {
      console.error('Error deleting internship:', error);
      toast.error('Failed to delete internship application');
    }
  }

  function handleEdit(internship: Internship) {
    setEditingInternship(internship);
    setShowEditDialog(true);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (internships.length === 0) {
    return (
      <div className="text-center py-10">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-3" />
        <h3 className="text-lg font-medium">No internship applications yet</h3>
        <p className="text-muted-foreground mb-4">Start adding your internship applications to track them</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {internships.map(internship => (
          <Card key={internship.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: getStatusColor(internship.status) }}>
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-lg">{internship.company}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>{internship.position}</span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
                  <Badge variant="outline" className={`${statusColors[internship.status]} mb-2`}>
                    {statusLabels[internship.status]}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>Applied: {format(new Date(internship.application_date), "MMM d, yyyy")}</span>
                  </div>
                  {internship.deadline_date && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Deadline: {format(new Date(internship.deadline_date), "MMM d, yyyy")}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {internship.notes && (
                <div className="mt-3 pt-3 border-t text-sm">
                  {internship.notes}
                </div>
              )}
              
              <div className="mt-4 flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8" 
                  onClick={() => handleEdit(internship)}
                >
                  <FileEdit className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-red-500 hover:text-red-600" 
                  onClick={() => handleDelete(internship.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showEditDialog && editingInternship && (
        <EditInternshipDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          internship={editingInternship}
          onInternshipUpdated={fetchInternships}
        />
      )}
    </>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'pending': return '#F59E0B';
    case 'applied': return '#3B82F6';
    case 'interview': return '#8B5CF6';
    case 'offer': return '#10B981';
    case 'rejected': return '#EF4444';
    default: return '#6B7280';
  }
}
