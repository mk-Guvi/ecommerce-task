import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}
function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
}: OptimizedImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className={`relative ${className}`}>
      {isLoading && <Skeleton className="absolute inset-0 bg-gray-200" />}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`object-contain transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoadingComplete={() => setLoading(false)}
        loading="lazy"
      />
    </div>
  );
}

export default OptimizedImage;
