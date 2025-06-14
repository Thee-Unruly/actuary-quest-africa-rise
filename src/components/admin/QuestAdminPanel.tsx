
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Quest = Database['public']['Tables']['quests']['Row'];
type QuestCategory = Database['public']['Tables']['quest_categories']['Row'];

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

  const handleSubmit = async (formData: FormData) => {
    const questData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category_id: formData.get('category_id') as string || null,
      reward_coins: parseInt(formData.get('reward_coins') as string) || 0,
      estimated_time: formData.get('estimated_time') as string || null,
      sort_order: parseInt(formData.get('sort_order') as string) || 0,
      is_active: formData.get('is_active') === 'true',
    };

    try {
      if (editingQuest) {
        const { error } = await supabase
          .from('quests')
          .update(questData)
          .eq('id', editingQuest.id);
        
        if (error) throw error;
        toast.success('Quest updated successfully!');
      } else {
        const { error } = await supabase
          .from('quests')
          .insert([questData]);
        
        if (error) throw error;
        toast.success('Quest created successfully!');
      }
      
      setIsDialogOpen(false);
      setEditingQuest(null);
      fetchQuests();
    } catch (error) {
      console.error('Error saving quest:', error);
      toast.error('Failed to save quest');
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
                <form action={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={editingQuest?.title || ''}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reward_coins">Reward Coins</Label>
                      <Input
                        id="reward_coins"
                        name="reward_coins"
                        type="number"
                        defaultValue={editingQuest?.reward_coins || 0}
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingQuest?.description || ''}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="category_id">Category</Label>
                      <Select name="category_id" defaultValue={editingQuest?.category_id || ''}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Category</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="estimated_time">Estimated Time</Label>
                      <Input
                        id="estimated_time"
                        name="estimated_time"
                        placeholder="e.g., 30 minutes"
                        defaultValue={editingQuest?.estimated_time || ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sort_order">Sort Order</Label>
                      <Input
                        id="sort_order"
                        name="sort_order"
                        type="number"
                        defaultValue={editingQuest?.sort_order || 0}
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="is_active">Status</Label>
                    <Select name="is_active" defaultValue={String(editingQuest?.is_active ?? true)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingQuest ? 'Update Quest' : 'Create Quest'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No quests found. Create your first quest to get started!
              </div>
            ) : (
              quests.map((quest) => (
                <div key={quest.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{quest.title}</h3>
                        <Badge variant={quest.is_active ? "default" : "secondary"}>
                          {quest.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {quest.reward_coins && (
                          <Badge variant="outline">
                            {quest.reward_coins} coins
                          </Badge>
                        )}
                      </div>
                      {quest.description && (
                        <p className="text-sm text-gray-600 mb-2">{quest.description}</p>
                      )}
                      <div className="flex gap-4 text-xs text-gray-500">
                        {quest.estimated_time && <span>⏱️ {quest.estimated_time}</span>}
                        <span>📋 Order: {quest.sort_order}</span>
                        {categories.find(c => c.id === quest.category_id) && (
                          <span>🏷️ {categories.find(c => c.id === quest.category_id)?.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(quest)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteQuest(quest.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
