export interface CurriculumItem {
  title: string;
  type?: "video" | "article" | "quiz" | "exercise";
  icon?: string;
  duration?: string;
  locked?: boolean;
  preview?: boolean;
  done?: boolean;
  desc?: string;
}
export interface CurriculumListProps {
  items: CurriculumItem[];
  variant?: "list" | "cards" | "detailed" | "timeline";
}
