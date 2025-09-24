import { request, gql } from 'graphql-request';
import { Post } from '@/models/Post';

const graphqlAPI: string = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT ?? '';

type PostDetails = {
  title: string;
  excerpt: string;
  featuredImage?: { url: string };
  author: {
    id: string;
    name: string;
    bio: string;
    photo?: { url: string };
  };
  createdAt: string;
  slug: string;
  content: { raw: object };
  categories: { name: string; slug: string }[];
};

type FeaturedPost = {
  author: {
    name: string;
    photo?: { url: string };
  };
  featuredImage?: { url: string };
  title: string;
  slug: string;
  createdAt: string;
};

export const getPosts = async (): Promise<Post[]> => {
  const query = gql`
    query MyQuery {
      posts {
        author {
          bio
          id
          name
          photo {
            url
          }
        }
        createdAt
        slug
        title
        excerpt
        featuredImage {
          url
        }
        categories {
          name
          slug
        }
      }
    }
  `;

  try {
    const result: { posts: Post[] } = await request(graphqlAPI, query);
    return result.posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return []; // Return empty array instead of crashing
  }
};

export const getCategories = async (): Promise<{ name: string; slug: string }[]> => {
  const query = gql`
    query GetGategories {
        categories {
          name
          slug
        }
    }
  `;

  try {
    const result: { categories: { name: string; slug: string }[] } = await request(graphqlAPI, query);
    return result.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return []; // Return empty array instead of crashing
  }
};

export const getPostDetails = async (slug: string): Promise<PostDetails | null> => {
  const query = gql`
    query GetPostDetails($slug : String!) {
      post(where: {slug: $slug}) {
        title
        excerpt
        featuredImage {
          url
        }
        author {
          id
          name
          bio
          photo {
            url
          }
        }
        createdAt
        slug
        content {
          raw
        }
        categories {
          name
          slug
        }
      }
    }
  `;

  try {
    const result: { post: PostDetails } = await request(graphqlAPI, query, { slug });
    return result.post || null;
  } catch (error) {
    console.error('Error fetching post details:', error);
    return null; // Return null instead of crashing
  }
};

interface SimilarPost {
  title: string;
  featuredImage?: { url: string };
  createdAt: string;
  slug: string;
}

export const getSimilarPosts = async (
  categories: string[],
  slug: string
): Promise<SimilarPost[]> => {
  const query = gql`
    query GetPostDetails($slug: String!, $categories: [String!]) {
      posts(
        where: {slug_not: $slug, AND: {categories_some: {slug_in: $categories}}}
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;
  
  try {
    const result: { posts: SimilarPost[] } = await request(graphqlAPI, query, { slug, categories });
    return result.posts || [];
  } catch (error) {
    console.error('Error fetching similar posts:', error);
    return []; // Return empty array instead of crashing
  }
};

interface AdjacentPost {
  title: string;
  featuredImage?: { url: string };
  createdAt: string;
  slug: string;
}

interface AdjacentPostsResult {
  next: AdjacentPost[];
  previous: AdjacentPost[];
}

export const getAdjacentPosts = async (
  createdAt: string,
  slug: string
): Promise<{ next: AdjacentPost | undefined; previous: AdjacentPost | undefined }> => {
  const query = gql`
    query GetAdjacentPosts($createdAt: DateTime!,$slug:String!) {
      next:posts(
        first: 1
        orderBy: createdAt_ASC
        where: {slug_not: $slug, AND: {createdAt_gte: $createdAt}}
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
      previous:posts(
        first: 1
        orderBy: createdAt_DESC
        where: {slug_not: $slug, AND: {createdAt_lte: $createdAt}}
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;

  try {
    const result: AdjacentPostsResult = await request(graphqlAPI, query, { slug, createdAt });
    return { 
      next: result.next?.[0] || undefined, 
      previous: result.previous?.[0] || undefined 
    };
  } catch (error) {
    console.error('Error fetching adjacent posts:', error);
    return { next: undefined, previous: undefined }; // Return empty result instead of crashing
  }
};

interface CategoryPostAuthor {
  bio: string;
  name: string;
  id: string;
  photo?: { url: string };
}

interface CategoryPostCategory {
  name: string;
  slug: string;
}

interface CategoryPostNode {
  author: CategoryPostAuthor;
  createdAt: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage?: { url: string };
  categories: CategoryPostCategory[];
}

interface CategoryPostEdge {
  cursor: string;
  node: CategoryPostNode;
}

interface CategoryPostResult {
  postsConnection: {
    edges: CategoryPostEdge[];
  };
}

export const getCategoryPost = async (slug: string): Promise<CategoryPostEdge[]> => {
  const query = gql`
    query GetCategoryPost($slug: String!) {
      postsConnection(where: {categories_some: {slug: $slug}}) {
        edges {
          node {
            author {
              bio
              name
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `;

  try {
    const result: CategoryPostResult = await request(graphqlAPI, query, { slug });
    return result.postsConnection?.edges || [];
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return []; // Return empty array instead of crashing
  }
};

export const getFeaturedPosts = async (): Promise<FeaturedPost[]> => {
  const query = gql`
    query GetCategoryPost {
      posts(where: {featuredPost: true}) {
        author {
          id
          name
          bio
          photo {
            url
          }
        }
        featuredImage {
          url
        }
        title
        slug
        createdAt
      }
    }   
  `;

  try {
    const result: { posts: FeaturedPost[] } = await request(graphqlAPI, query);
    return result.posts || [];
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return []; // Return empty array instead of crashing
  }
};

interface CommentPayload {
  name: string;
  email?: string;
  comment: string;
  slug: string;
}

interface SubmitCommentResponse {
  success: boolean;
  message?: string;
  // Add specific properties here if needed, or remove the index signature
}

export const submitComment = async (obj: CommentPayload): Promise<SubmitCommentResponse> => {
  try {
    const result = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    });

    const data = await result.json();
    
    if (!result.ok) {
      console.error('Comment submission failed:', data);
      return {
        success: false,
        message: data.message || 'Failed to submit comment'
      };
    }

    return data;
  } catch (error) {
    console.error('Error submitting comment:', error);
    return {
      success: false,
      message: 'Network error. Please try again later.'
    };
  }
};

interface Comment {
  name: string;
  createdAt: string;
  comment: string;
}

interface GetCommentsResult {
  comments: Comment[];
}

export const getComments = async (slug: string): Promise<Comment[]> => {
  console.log('Starting getComments for slug:', slug);
  
  // Strategy 1: Standard post-comment relationship
  try {
    console.log('Trying standard relationship query...');
    const query1 = gql`
      query GetComments($slug: String!) {
        comments(where: { post: { slug: $slug } }) {
          name
          createdAt
          comment
        }
      }
    `;
    const result1: GetCommentsResult = await request(graphqlAPI, query1, { slug });
    console.log('Standard query result:', result1);
    if (result1.comments && result1.comments.length > 0) {
      return result1.comments;
    }
  } catch (error) {
    console.error('Standard query failed:', error);
  }

  // Strategy 2: Get all comments with post info for debugging
  try {
    console.log('Trying all comments with post info query...');
    const query2 = gql`
      query GetAllCommentsWithPost {
        comments {
          name
          createdAt
          comment
          post {
            slug
            title
          }
        }
      }
    `;
    const result2: { comments: (Comment & { post?: { slug: string; title: string } })[] } = await request(graphqlAPI, query2);
    console.log('All comments with post info:', result2);
    
    // Filter comments for this specific post if post relationship exists
    if (result2.comments) {
      const filteredComments = result2.comments.filter((comment: Comment & { post?: { slug: string; title: string } }) => 
        comment.post && comment.post.slug === slug
      );
      console.log('Filtered comments for slug:', filteredComments);
      if (filteredComments.length > 0) {
        return filteredComments;
      }
    }
  } catch (error) {
    console.error('All comments with post info query failed:', error);
  }

  // Strategy 3: Get all comments without post relationship
  try {
    console.log('Trying all comments without relationship query...');
    const query3 = gql`
      query GetAllComments {
        comments {
          name
          createdAt
          comment
        }
      }
    `;
    const result3: GetCommentsResult = await request(graphqlAPI, query3);
    console.log('All comments without relationship:', result3);
    
    // Return all comments if we can't filter by post
    if (result3.comments) {
      console.log('Returning all comments since post filtering failed');
      return result3.comments;
    }
  } catch (error) {
    console.error('All comments query failed:', error);
  }

  console.log('All query strategies failed, returning empty array');
  return [];
};

export const getRecentPosts = async (): Promise<{ title: string; featuredImage?: { url: string }; createdAt: string; slug: string }[]> => {
  const query = gql`
    query GetPostDetails {
      posts(
        orderBy: createdAt_ASC
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;
  
  try {
    const result: { posts: { title: string; featuredImage?: { url: string }; createdAt: string; slug: string }[] } = await request(graphqlAPI, query);
    return result.posts || [];
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    return []; // Return empty array instead of crashing
  }
};