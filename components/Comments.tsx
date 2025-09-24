'use client'

import React, { useEffect, useState } from 'react';
import moment from 'moment';
import parse from 'html-react-parser';

import { getComments } from '@/services';

interface Comment {
  name: string;
  createdAt: string;
  comment: string;
}

interface CommentsProps {
  slug: string;
}

const Comments = ({ slug }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching comments for slug:', slug);
        const result = await getComments(slug);
        console.log('Comments fetched:', result);
        setComments(result || []);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments');
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchComments();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
        <h3 className="text-xl mb-8 font-semibold border-b pb-4">Comments</h3>
        <p className="text-gray-500">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
      <h3 className="text-xl mb-8 font-semibold border-b pb-4">
        {comments.length > 0 ? `${comments.length} Comments` : 'Comments'}
      </h3>
      
      {error && (
        <p className="text-red-500 mb-4">Unable to load comments. Please try refreshing the page.</p>
      )}
      
      {!error && comments.length === 0 && (
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      )}

      {!error && comments.length > 0 && (
        <div>
          {comments.map((comment, index) => (
            <div key={index} className="border-b border-gray-100 mb-4 pb-4">
              <p className="mb-4">
                <span className="font-semibold">{comment.name}</span>
                {' '}
                on
                {' '}
                {moment(comment.createdAt).format('MMM DD, YYYY')}
              </p>
              <p className="whitespace-pre-line text-gray-600 w-full">{parse(comment.comment)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;