
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from "@/components/ui/form";

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

interface QuestFormProps {
  quest: Quest | null;
  categories: QuestCategory[];
  onSubmit: (data: QuestFormData) => void;
  onCancel: () => void;
}

export default function QuestForm({ quest, categories, onSubmit, onCancel }: QuestFormProps) {
  const form = useForm<QuestFormData>({
    defaultValues: {
      title: quest?.title || '',
      description: quest?.description || '',
      category_id: quest?.category_id || 'none',
      reward_coins: quest?.reward_coins || 0,
      estimated_time: quest?.estimated_time || '',
      sort_order: quest?.sort_order || 0,
      is_active: quest?.is_active ?? true,
    },
  });

  const handleSubmit = (data: QuestFormData) => {
    console.log('Form data being submitted:', data);
    // Convert 'none' back to empty string for the database
    const submitData = {
      ...data,
      category_id: data.category_id === 'none' ? '' : data.category_id
    };
    onSubmit(submitData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reward_coins"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reward Coins</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    min="0"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No Category</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estimated_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Time</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., 30 minutes" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    min="0"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={String(field.value)}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {quest ? 'Update Quest' : 'Create Quest'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
