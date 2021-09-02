export interface IArticle {
  id: number;
  userId: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  content: string;
  createdAt: Date;
  lastUpdate: Date | null;
}
