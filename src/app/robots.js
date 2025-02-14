export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      process.env.NEXT_PUBLIC_DOMAIN + '/topics/sitemap.xml',
      process.env.NEXT_PUBLIC_DOMAIN + '/posts/sitemap.xml',
    ],
  };
}
