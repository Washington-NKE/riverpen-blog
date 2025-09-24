'use client';

import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { FeaturedPostCard } from '@/components';
import { getFeaturedPosts } from '@/services';

// Define the type locally to match services
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

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 1024 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 768, min: 640 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 1,
  },
};

const FeaturedPosts = () => {
  const [featuredPosts, setFeaturedPosts] = useState<FeaturedPost[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setError(null);
        const result = await getFeaturedPosts();
        setFeaturedPosts(result);
        setDataLoaded(true);
      } catch (err) {
        console.error('Error fetching featured posts:', err);
        setError('Failed to load featured posts');
        setDataLoaded(true);
        setFeaturedPosts([]);
      }
    };

    fetchFeaturedPosts();
  }, []);

  const customLeftArrow = (
    <div className="absolute arrow-btn left-0 text-center py-3 cursor-pointer bg-gradient-to-r from-[#cd19ff] to-[#e000ac] rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </div>
  );

  const customRightArrow = (
    <div className="absolute arrow-btn right-0 text-center py-3 cursor-pointer bg-gradient-to-r from-[#cd19ff] to-[#e000ac] rounded-full">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </div>
  );

  if (!dataLoaded) {
    return (
      <div className="mb-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <p className="text-center text-gray-500">Loading featured posts...</p>
        </div>
      </div>
    );
  }

  if (error || featuredPosts.length === 0) {
    return null; // Don't show the carousel if there are no featured posts or an error
  }

  return (
    <div className="mb-8">
      <Carousel infinite customLeftArrow={customLeftArrow} customRightArrow={customRightArrow} responsive={responsive} itemClass="px-4">
        {featuredPosts.map((post, index) => (
          <FeaturedPostCard key={index} post={post} />
        ))}
      </Carousel>
    </div>
  );
};

export default FeaturedPosts;