import { config } from "@/config/config";
import { ImageKitProvider } from "@imagekit/react";
import React from "react";

const ImagekitProviderParent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const imagekitUniqueId = config.imagekitUniqueId;
  if (!imagekitUniqueId) {
    return;
  }
  return (
    <ImageKitProvider
      urlEndpoint={`https://ik.imagekit.io/${imagekitUniqueId}`}
    >
      {children}
    </ImageKitProvider>
  );
};

export default ImagekitProviderParent;
