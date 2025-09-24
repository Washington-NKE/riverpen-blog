// Post type definitions based on GraphCMS schema

export interface Author {
  bio: string;
  name: string;
  id: string;
  photo?: {
    url: string;
  };
}

export interface Category {
  name: string;
  slug: string;
}

export interface FeaturedImage {
  url: string;
}

export interface ContentRaw {
  raw: unknown; // This would contain the rich text content structure
}

export interface Post {
  author: Author;
  categories: Category[];
  content?: ContentRaw;
  createdAt: string;
  excerpt: string;
  featuredImage?: FeaturedImage;
  featuredPost?: boolean;
  slug: string;
  title: string;
}

// For paginated responses
export interface PostEdge {
  cursor: string;
  node: Post;
}

export interface PostsConnection {
  edges: PostEdge[];
}

// For adjacent posts (simplified structure)
export interface AdjacentPost {
  title: string;
  featuredImage?: FeaturedImage;
  createdAt: string;
  slug: string;
}