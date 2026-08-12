const conf: Record<string, string> = {
  baseUrl: import.meta.env.VITE_API_URL,
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  imagekitUniqueId: import.meta.env.VITE_IMAGEKIT_ID,
};

export const config = Object.freeze(conf);
