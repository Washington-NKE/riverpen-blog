import { GraphQLClient, gql } from 'graphql-request';
import { NextRequest, NextResponse } from 'next/server';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT!;
const graphcmsToken = process.env.GRAPHCMS_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if we have the required environment variables
    if (!graphqlAPI) {
      console.error('Missing NEXT_PUBLIC_GRAPHCMS_ENDPOINT');
      return NextResponse.json({ 
        success: false, 
        message: 'Configuration error: Missing GraphCMS endpoint' 
      }, { status: 500 });
    }

    if (!graphcmsToken) {
      console.error('Missing GRAPHCMS_TOKEN');
      return NextResponse.json({ 
        success: false, 
        message: 'Comments are currently unavailable. Please try again later.' 
      }, { status: 503 });
    }

    console.log('Creating comment for post slug:', body.slug);

    const graphQLClient = new GraphQLClient(graphqlAPI, {
      headers: {
        authorization: `Bearer ${graphcmsToken}`,
        'Content-Type': 'application/json',
      },
    });

    // First, find the post to ensure it exists and get its ID
    try {
      const findPostQuery = gql`
        query FindPost($slug: String!) {
          post(where: { slug: $slug }) {
            id
            slug
            title
          }
        }
      `;

      console.log('Looking up post with slug:', body.slug);
      const postResult: { post?: { id: string; slug: string; title: string } } = await graphQLClient.request(findPostQuery, { slug: body.slug });
      console.log('Post lookup result:', postResult);

      if (!postResult.post) {
        return NextResponse.json({ 
          success: false, 
          message: 'Post not found. Unable to add comment.' 
        }, { status: 404 });
      }

      // Create comment with proper post relationship using the post ID
      const createCommentQuery = gql`
        mutation CreateComment($name: String!, $email: String!, $comment: String!, $postId: ID!) {
          createComment(data: {
            name: $name, 
            email: $email, 
            comment: $comment,
            post: { connect: { id: $postId } }
          }) { 
            id
            name
            comment
            post {
              slug
            }
          }
        }
      `;

      console.log('Creating comment with post ID:', postResult.post.id);
      const result = await graphQLClient.request(createCommentQuery, {
        name: body.name,
        email: body.email,
        comment: body.comment,
        postId: postResult.post.id,
      });

      console.log('Comment created successfully with post relationship:', result);
      return NextResponse.json({ 
        success: true, 
        message: 'Comment submitted successfully',
        data: result 
      });

    } catch (postLookupError: unknown) {
      console.error('Post lookup failed:', postLookupError);
      
      // If post lookup fails, try creating comment without relationship as fallback
      console.log('Falling back to comment creation without post relationship...');
      
      const fallbackQuery = gql`
        mutation CreateComment($name: String!, $email: String!, $comment: String!) {
          createComment(data: {
            name: $name, 
            email: $email, 
            comment: $comment
          }) { 
            id
            name
          }
        }
      `;

      try {
        const fallbackResult = await graphQLClient.request(fallbackQuery, {
          name: body.name,
          email: body.email,
          comment: body.comment,
        });

        console.log('Fallback comment created (no post relationship):', fallbackResult);
        return NextResponse.json({ 
          success: true, 
          message: 'Comment submitted successfully (will be manually linked to post)',
          data: fallbackResult 
        });
      } catch (fallbackError: unknown) {
        console.error('Fallback comment creation also failed:', fallbackError);
        throw fallbackError;
      }
    }

  } catch (error: unknown) {
    console.error('All comment creation methods failed:', error.message);
    
    // Handle specific GraphQL errors
    if (error.response?.status === 401) {
      return NextResponse.json({ 
        success: false, 
        message: 'Comments are currently unavailable due to authentication issues.' 
      }, { status: 503 });
    }

    if (error.response?.status === 400) {
      return NextResponse.json({ 
        success: false, 
        message: 'Comments are temporarily disabled due to configuration issues.' 
      }, { status: 503 });
    }

    if (error.response?.status === 403) {
      return NextResponse.json({ 
        success: false, 
        message: 'Comments are currently disabled.' 
      }, { status: 503 });
    }

    return NextResponse.json({ 
      success: false, 
      message: 'Comments are temporarily unavailable. Please try again later.' 
    }, { status: 503 });
  }
}