
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Database } from "@/integrations/supabase/types";

type Quest = Database['public']['Tables']['quests']['Row'];
type QuestCategory = Database['public']['Tables']['quest_categories']['Row'];

interface QuestFormProps {
  quest: Quest | null;
  categories: QuestCategory[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export default function QuestForm({ quest, categories, onSubmit, onCancel }: QuestFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={quest?.title || ''}
            required
          />
        </div>
        <div>
          <Label htmlFor="reward_coins">Reward Coins</Label>
          <Input
            id="reward_coins"
            name="reward_coins"
            type="number"
            defaultValue={quest?.reward_coins || 0}
            min="0"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={quest?.description || ''}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="category_id">Category</Label>
          <Select name="category_id" defaultValue={quest?.category_id || ''}>
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
            defaultValue={quest?.estimated_time || ''}
          />
        </div>
        <div>
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={quest?.sort_order || 0}
            min="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="is_active">Status</Label>
        <Select name="is_active" defaultValue={String(quest?.is_active ?? true)}>
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {quest ? 'Update Quest' : 'Create Quest'}
        </Button>
      </div>
    </form>
  );
}
