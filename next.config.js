/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
};

// module.exports = nextConfig;

module.exports = {
  reactStrictMode: true,
  basePath: "",
  images: {
    domains: ['cdn.pixabay.com'], // veya resimlerin bulunduğu alan adlarını ekleyin
  },
};