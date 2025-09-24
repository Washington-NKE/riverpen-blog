'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';

import { getSimilarPosts, getRecentPosts } from '@/services';

interface PostWidgetPost {
  title: string;
  featuredImage?: {
    url: string;
  };
  createdAt: string;
  slug: string;
}

interface PostWidgetProps {
  categories: string[];
  slug: string;
}

const PostWidget = ({ categories, slug }: PostWidgetProps) => {
  const [relatedPosts, setRelatedPosts] = useState<PostWidgetPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let result: PostWidgetPost[];
        
        if (slug) {
          result = await getSimilarPosts(categories, slug);
        } else {
          result = await getRecentPosts();
        }
        
        setRelatedPosts(result);
      } catch (err) {
        console.error('Error fetching posts for widget:', err);
        setError('Failed to load posts');
        setRelatedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [slug, categories]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">{slug ? 'Related Posts' : 'Recent Posts'}</h3>
      
      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading posts...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Unable to load posts</p>
        </div>
      ) : relatedPosts.length > 0 ? (
        relatedPosts.map((post, index) => (
          <div key={index} className="flex items-center w-full mb-4">
            <div className="flex-none">
              {post.featuredImage && (
                <Image
                  alt={post.title}
                  height={60}
                  width={60}
                  unoptimized
                  className="align-middle rounded-full"
                  src={post.featuredImage.url}
                />
              )}
            </div>
            <div className="flex-grow ml-4">
              <p className="text-gray-500 font-xs">{moment(post.createdAt).format('MMM DD, YYYY')}</p>
              <Link href={`/post/${post.slug}`} className="text-md" key={index}>{post.title}</Link>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No posts available</p>
        </div>
      )}
    </div>
  );
};

export default PostWidget;