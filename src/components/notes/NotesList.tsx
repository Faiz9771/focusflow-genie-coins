
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen,
  Calendar,
  Tag,
  FileEdit,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type NoteCategory = "general" | "study" | "work" | "personal" | "idea";

type Note = {
  id: string;
  title: string;
  content: string | null;
  category: NoteCategory;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
};

const categoryColors = {
  general: "bg-gray-100 text-gray-800 border-gray-200",
  study: "bg-blue-100 text-blue-800 border-blue-200",
  work: "bg-purple-100 text-purple-800 border-purple-200",
  personal: "bg-green-100 text-green-800 border-green-200",
  idea: "bg-amber-100 text-amber-800 border-amber-200",
};

const categoryLabels = {
  general: "General",
  study: "Study",
  work: "Work",
  personal: "Personal",
  idea: "Idea",
};

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type casting the note data to ensure it matches our Note type
      const typedData = data?.map(item => ({
        ...item,
        category: item.category as NoteCategory
      })) || [];
      
      setNotes(typedData);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setNotes(notes.filter(item => item.id !== id));
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-10">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-30 mb-3" />
        <h3 className="text-lg font-medium">No notes yet</h3>
        <p className="text-muted-foreground mb-4">Start capturing your thoughts and ideas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map(note => (
        <Card key={note.id} className="overflow-hidden">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <h3 className="font-semibold text-lg">{note.title}</h3>
                </div>
                
                <Badge variant="outline" className={`${categoryColors[note.category]} mb-3`}>
                  {categoryLabels[note.category]}
                </Badge>
                
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {note.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {format(new Date(note.created_at), "MMM d, yyyy")}
              </div>
            </div>
            
            {note.content && (
              <div className="mt-2 text-sm whitespace-pre-line">
                {note.content}
              </div>
            )}
            
            <div className="mt-4 flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 text-red-500 hover:text-red-600" 
                onClick={() => handleDelete(note.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
