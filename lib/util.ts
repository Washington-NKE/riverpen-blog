// Utility functions for the blog

// GraphCMS Image Loader for Next.js Image component
export const grpahCMSImageLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};