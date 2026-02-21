import Image from 'next/image';
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  fill, 
  className, 
  sizes,
  priority = false,
  onLoad,
  onError
}: OptimizedImageProps) => {
  const handleImageError = () => {
    console.warn(`Image failed to load: ${src}`);
    onError?.();
  };

  const handleImageLoad = () => {
    console.log(`Image loaded successfully: ${src}`);
    onLoad?.();
  };

  // Always use Next.js Image component with optimization features
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={handleImageError}
      onLoad={handleImageLoad}
      // Optimization settings for modern Next.js Image component
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjwvc3ZnPg=="
    />
  );
};

export default OptimizedImage;