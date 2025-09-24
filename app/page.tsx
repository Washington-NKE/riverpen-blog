
import Categories from '@/components/Categories';
import PostCard from '@/components/PostCard';
import PostWidget from '@/components/PostWidget';
import FeaturedPosts from '@/components/sections/FeaturedPosts';
import { getPosts } from '@/services';
import { Post } from '@/models/Post';

// Force dynamic rendering to show new posts immediately
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const posts: Post[] = (await getPosts()) || [];

  return (
    <div className="container mx-auto px-10 mb-8">
      <FeaturedPosts />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 col-span-1">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))
          ) : (
            <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-center mb-4">No Posts Available</h2>
              <p className="text-center text-gray-600">
                There was an issue loading posts. Please check your connection and try refreshing the page.
              </p>
            </div>
          )}
        </div>
        <div className="lg:col-span-4 col-span-1">
          <div className="lg:sticky relative top-8">
            <PostWidget categories={[]} slug={''} />
            <Categories />
          </div>
        </div>
      </div>
    </div>
  );
}