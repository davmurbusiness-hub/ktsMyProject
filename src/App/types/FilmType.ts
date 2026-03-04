import type { Category } from './CategoryType.ts';
import type { Poster } from './PosterType.ts';
import type { Gallery } from './GalleryType.ts';

export type Film = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  shortDescription: string;
  releaseYear: number;
  duration: number;
  rating: number;
  ageLimit: number;
  isFeatured: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  trailerUrl: string;
  category: Category;
  poster: Poster;
  gallery: Gallery[];
};
