import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";
import QuestForm from "./QuestForm";
import QuestList from "./QuestList";

type Quest = Database['public']['Tables']['quests']['Row'];
type QuestCategory = Database['public']['Tables']['quest_categories']['Row'];

interface QuestFormData {
  title: string;
  description: string;
  category_id: string;
  reward_coins: number;
  estimated_time: string;
  sort_order: number;
  is_active: boolean;
}

export default function QuestAdminPanel() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [categories, setCategories] = useState<QuestCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchQuests();
    fetchCategories();
  }, []);

  const fetchQuests = async () => {
    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setQuests(data || []);
    } catch (error) {
      console.error('Error fetching quests:', error);
      toast.error('Failed to load quests');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('quest_categories')
        .select('*')
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (data: QuestFormData) => {
    console.log('Received form data:', data);
    
    try {
      // Prepare the data for Supabase
      const questData = {
        title: data.title,
        description: data.description,
        category_id: data.category_id || null, // Convert empty string to null
        reward_coins: data.reward_coins,
        estimated_time: data.estimated_time || null, // Convert empty string to null
        sort_order: data.sort_order,
        is_active: data.is_active,
      };

      console.log('Submitting quest data:', questData);

      if (editingQuest) {
        const { error } = await supabase
          .from('quests')
          .update(questData)
          .eq('id', editingQuest.id);
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        toast.success('Quest updated successfully!');
      } else {
        const { error } = await supabase
          .from('quests')
          .insert([questData]);
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        toast.success('Quest created successfully!');
      }
      
      setIsDialogOpen(false);
      setEditingQuest(null);
      await fetchQuests(); // Refresh the list
    } catch (error) {
      console.error('Error saving quest:', error);
      toast.error(`Failed to save quest: ${error.message}`);
    }
  };

  const deleteQuest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quest?')) return;
    
    try {
      const { error } = await supabase
        .from('quests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('Quest deleted successfully!');
      fetchQuests();
    } catch (error) {
      console.error('Error deleting quest:', error);
      toast.error('Failed to delete quest');
    }
  };

  const openEditDialog = (quest: Quest) => {
    setEditingQuest(quest);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingQuest(null);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading quests...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Manage Learning Quests
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Quest
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingQuest ? 'Edit Quest' : 'Create New Quest'}
                  </DialogTitle>
                </DialogHeader>
                <QuestForm
                  quest={editingQuest}
                  categories={categories}
                  onSubmit={handleSubmit}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <QuestList
            quests={quests}
            categories={categories}
            onEdit={openEditDialog}
            onDelete={deleteQuest}
          />
        </CardContent>
      </Card>
    </div>
  );
}
