export interface Movie {
  id: string;
  title: string;
  description?: string | null;
  genre: string;
  rating?: number | null;
  releaseDate?: Date | null;
  posterUrl?: string | null;
  director?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MovieFormData {
  title: string;
  description?: string;
  genre: string;
  rating?: number;
  releaseDate?: string;
  posterUrl?: string;
  director?: string;
}
