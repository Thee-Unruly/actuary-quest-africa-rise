
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Quest = Database['public']['Tables']['quests']['Row'];
type QuestCategory = Database['public']['Tables']['quest_categories']['Row'];

interface QuestCardProps {
  quest: Quest;
  categories: QuestCategory[];
  onEdit: (quest: Quest) => void;
  onDelete: (id: string) => void;
}

export default function QuestCard({ quest, categories, onEdit, onDelete }: QuestCardProps) {
  const category = categories.find(c => c.id === quest.category_id);

  return (
    <div className="border rounded-lg p-4 space-y-2">
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
            {category && <span>🏷️ {category.name}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(quest)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(quest.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
