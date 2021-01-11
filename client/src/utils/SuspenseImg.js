import React, { Suspense } from "react";
import { Img, useImage } from "react-image";

// Create image component for suspensed image
const ImageComponent = ({
  alt,
  img,
  className,
}) => {
  const { src } = useImage({
    srcList: img,
  });

  return <img src={src} alt={alt} className={className} />;
};


export const SuspenseImg = ({ alt, img, fallback }) => (
  <Suspense
    fallback={
      <Img alt={alt} src={fallback.img} className={fallback.className} />
    }
  >
    <ImageComponent alt={alt} img={img.img} className={img.className} />
  </Suspense>
);
