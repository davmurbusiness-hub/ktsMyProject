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
    category: any;
    poster: any;
    gallery: any;
}

export type ApiResponse = {
    data: any;
    meta: {
        pagination: {
            page: number;
            pageCount: number;
            total: number;
        }
    }
}

