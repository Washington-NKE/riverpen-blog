import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { getCategoryPost } from '@/services';
import { PostCard, Categories } from '@/components';
import { PostEdge } from '@/models/Post';

interface CategoryPostProps {
  params: { slug: string };
}

export default async function CategoryPost({ params }: CategoryPostProps) {
  const { slug } = await params;
  
  if (!slug) {
    notFound();
  }

  try {
    const posts: PostEdge[] = await getCategoryPost(slug);
    
    return (
      <div className="container mx-auto px-10 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="col-span-1 lg:col-span-8">
            {posts && posts.length > 0 ? (
              posts.map((post, index) => (
                <PostCard key={index} post={post.node} />
              ))
            ) : (
              <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
                <h2 className="text-2xl font-semibold text-center mb-4">No Posts Found</h2>
                <p className="text-center text-gray-600">
                  No posts were found in this category. Please try another category or check back later.
                </p>
              </div>
            )}
          </div>
          <div className="col-span-1 lg:col-span-4">
            <div className="relative lg:sticky top-8">
              <Categories />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading category posts:', error);
    return (
      <div className="container mx-auto px-10 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-semibold text-red-600 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t load posts for this category. There may be a connection issue.
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