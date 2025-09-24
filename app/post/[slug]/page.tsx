import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { PostDetail, Categories, PostWidget, Author, Comments, CommentsForm } from '@/components';
import { getPostDetails } from '@/services';
import AdjacentPosts from '@/components/sections/AdjacentPosts';

interface PostDetailsProps {
  params: { slug: string };
}

export default async function PostDetails({ params }: PostDetailsProps) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  try {
    const post = await getPostDetails(slug);
    
    if (!post) {
      notFound();
    }

    return (
      <>
        <div className="container mx-auto px-10 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="col-span-1 lg:col-span-8">
              <PostDetail post={post} />
              <Author author={post.author} />
              <AdjacentPosts slug={post.slug} createdAt={post.createdAt} />
              <CommentsForm slug={post.slug} />
              <Comments slug={post.slug} />
            </div>
            <div className="col-span-1 lg:col-span-4">
              <div className="relative lg:sticky top-8">
                <PostWidget slug={post.slug} categories={post.categories.map((category) => category.slug)} />
                <Categories />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch (error) {
    console.error('Error loading post:', error);
    return (
      <div className="container mx-auto px-10 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-semibold text-red-600 mb-4">Post Not Found</h1>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t load this post. It may not exist or there was an issue connecting to our servers.
          </p>
          <Link 
            href="/"
            className="bg-gradient-to-r from-[#cd19ff] to-[#e000ac] text-white px-6 py-3 rounded-full hover:opacity-90 transition duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
}