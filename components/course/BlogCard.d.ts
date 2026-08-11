export interface BlogCardProps {
  index?: number;
  title: string;
  excerpt?: string;
  image?: string;
  tag?: string;
  authorName?: string;
  date?: string;
  readTime?: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}
