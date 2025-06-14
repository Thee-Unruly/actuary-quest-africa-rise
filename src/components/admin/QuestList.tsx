
import QuestCard from "./QuestCard";
import { Database } from "@/integrations/supabase/types";

type Quest = Database['public']['Tables']['quests']['Row'];
type QuestCategory = Database['public']['Tables']['quest_categories']['Row'];

interface QuestListProps {
  quests: Quest[];
  categories: QuestCategory[];
  onEdit: (quest: Quest) => void;
  onDelete: (id: string) => void;
}

export default function QuestList({ quests, categories, onEdit, onDelete }: QuestListProps) {
  if (quests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No quests found. Create your first quest to get started!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quests.map((quest) => (
        <QuestCard
          key={quest.id}
          quest={quest}
          categories={categories}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
