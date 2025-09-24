import React from 'react';
import Image from 'next/image';
import moment from 'moment';
import { Post } from '@/models/Post';

interface PostDetailProps {
  post: Post;
}

// Type definitions for content structure
interface ContentItem {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

interface ContentObject {
  children: ContentItem[];
  type: string;
  title?: string;
  height?: number;
  width?: number;
  src?: string;
}

interface ContentRaw {
  children: ContentObject[];
}

const PostDetail = ({ post }: PostDetailProps) => {
  const getContentFragment = (index: number, text: string | React.ReactNode[], obj?: ContentItem | ContentObject, type?: string): React.ReactNode => {
    let modifiedText: React.ReactNode = text;

    if (obj && 'bold' in obj) {
      if (obj.bold) {
        modifiedText = (<b key={index}>{text}</b>);
      }

      if (obj.italic) {
        modifiedText = (<em key={index}>{text}</em>);
      }

      if (obj.underline) {
        modifiedText = (<u key={index}>{text}</u>);
      }
    }

    switch (type) {
      case 'heading-three':
        return (
          <h3 key={index} className="text-xl font-semibold mb-4">
            {Array.isArray(modifiedText) ? modifiedText.map((item, i) => (
              <React.Fragment key={i}>{item}</React.Fragment>
            )) : modifiedText}
          </h3>
        );
      case 'paragraph':
        return (
          <p key={index} className="mb-8">
            {Array.isArray(modifiedText) ? modifiedText.map((item, i) => (
              <React.Fragment key={i}>{item}</React.Fragment>
            )) : modifiedText}
          </p>
        );
      case 'heading-four':
        return (
          <h4 key={index} className="text-md font-semibold mb-4">
            {Array.isArray(modifiedText) ? modifiedText.map((item, i) => (
              <React.Fragment key={i}>{item}</React.Fragment>
            )) : modifiedText}
          </h4>
        );
      case 'image':
        if (obj && 'src' in obj && obj.src) {
          return (
            <Image
              key={index}
              alt={obj.title || 'Content image'}
              height={obj.height || 400}
              width={obj.width || 600}
              src={obj.src}
              className="mb-8 rounded-lg"
              unoptimized
            />
          );
        }
        return null;
      default:
        return modifiedText;
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg lg:p-8 pb-12 mb-8">
      {post.featuredImage && (
        <div className="relative overflow-hidden shadow-md mb-6">
          <Image
            src={post.featuredImage.url}
            alt={post.title}
            width={800}
            height={400}
            className="object-top object-cover shadow-lg rounded-t-lg lg:rounded-lg w-full"
            unoptimized
          />
        </div>
      )}
      <div className="px-4 lg:px-0">
        <div className="flex items-center mb-8 w-full">
          <div className="hidden md:flex items-center justify-center lg:mb-0 lg:w-auto mr-8">
            {post.author.photo && (
              <Image
                alt={post.author.name}
                height={30}
                width={30}
                className="align-middle rounded-full"
                src={post.author.photo.url}
                unoptimized
              />
            )}
            <p className="inline align-middle text-gray-700 ml-2 font-medium text-lg">{post.author.name}</p>
          </div>
          <div className="font-medium text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline mr-2 bg-gradient-to-r from-[#cd19ff] to-[#e000ac] bg-clip-text text-transparent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="align-middle">{moment(post.createdAt).format('MMM DD, YYYY')}</span>
          </div>
        </div>
        <h1 className="mb-8 text-3xl font-semibold">{post.title}</h1>
        
        {/* Render the full content instead of just excerpt */}
        {post.content?.raw && typeof post.content.raw === 'object' && 'children' in post.content.raw ? (
          <div className="prose max-w-none">
            {(post.content.raw as ContentRaw).children.map((typeObj: ContentObject, index: number) => {
              const children = typeObj.children.map((item: ContentItem, itemindex: number) => 
                getContentFragment(itemindex, item.text, item)
              );

              return getContentFragment(index, children, typeObj, typeObj.type);
            })}
          </div>
        ) : (
          // Fallback to excerpt if content structure is not available
          <div className="prose max-w-none">
            <p>{post.excerpt}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
