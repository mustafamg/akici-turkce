
export interface Category {
  id: number;
  name: string;
}

export interface Video {
  id: number;
  youtubeId: string;
  youtubeUrl: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  transcriptUrl: string | null;
  difficulty: string;
  categories: Category[];
}
