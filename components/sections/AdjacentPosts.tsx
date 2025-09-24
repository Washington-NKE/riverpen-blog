'use client';

import React, { useState, useEffect } from 'react';
import { getAdjacentPosts } from '@/services';
import AdjacentPostCard from '@/components/AdjacentPostCard';


interface AdjacentPostsProps {
  createdAt: string;
  slug: string;
}

// Update the import path below to the correct location of your Post type
import { AdjacentPost } from '../../models/Post'; // Using AdjacentPost for the simpler structure

interface AdjacentPostData {
  previous: AdjacentPost | undefined;
  next: AdjacentPost | undefined;
}

const AdjacentPosts = ({ createdAt, slug }: AdjacentPostsProps) => {
  const [adjacentPost, setAdjacentPost] = useState<AdjacentPostData | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdjacentPosts = async () => {
      try {
        setError(null);
        const result = await getAdjacentPosts(createdAt, slug);
        setAdjacentPost(result);
        setDataLoaded(true);
      } catch (err) {
        console.error('Error fetching adjacent posts:', err);
        setError('Failed to load related posts');
        setDataLoaded(true);
        setAdjacentPost(null);
      }
    };

    fetchAdjacentPosts();
  }, [slug, createdAt]);

  if (!dataLoaded) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-12 mb-8">
        <div className="col-span-1 lg:col-span-8 bg-white shadow-lg rounded-lg p-8">
          <p className="text-center text-gray-500">Loading related posts...</p>
        </div>
      </div>
    );
  }

  if (error || !adjacentPost) {
    return null; // Don't show anything if there's an error or no adjacent posts
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-8 gap-12 mb-8">
      {dataLoaded && adjacentPost && (
        <>
          {adjacentPost.previous && (
            <div className={`${adjacentPost.next ? 'col-span-1 lg:col-span-4' : 'col-span-1 lg:col-span-8'} adjacent-post rounded-lg relative h-72`}>
              <AdjacentPostCard post={adjacentPost.previous} position="LEFT" />
            </div>
          )}
          {adjacentPost.next && (
            <div className={`${adjacentPost.previous ? 'col-span-1 lg:col-span-4' : 'col-span-1 lg:col-span-8'} adjacent-post rounded-lg relative h-72`}>
              <AdjacentPostCard post={adjacentPost.next} position="RIGHT" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdjacentPosts;