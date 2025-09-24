'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { getCategories } from '@/services';
import { Category } from '@/models/Post';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const newCategories = await getCategories();
        setCategories(newCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">Categories</h3>
      
      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading categories...</p>
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Unable to load categories</p>
        </div>
      ) : categories.length > 0 ? (
        categories.map((category, index) => (
          <Link key={index} href={`/category/${category.slug}`}>
            <span className={`cursor-pointer block ${(index === categories.length - 1) ? 'border-b-0' : 'border-b'} pb-3 mb-3`}>{category.name}</span>
          </Link>
        ))
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">No categories available</p>
        </div>
      )}
    </div>
  );
};

export default Categories;