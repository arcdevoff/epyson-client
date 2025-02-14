import axios from 'axios';

function unixTimeToSitemapFormat(unixTime) {
  let date = new Date(unixTime * 1000);
  let sitemapFormat = date.toISOString();

  return sitemapFormat;
}

export default async function sitemap() {
  const result = [];

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/posts/sitemap', {
    cache: 'no-store',
  });
  const data = await res.json();

  data.map((post) => {
    result.push({
      url: process.env.NEXT_PUBLIC_DOMAIN + '/post/' + post.id,
      lastModified: post.updated_at
        ? unixTimeToSitemapFormat(post.updated_at)
        : unixTimeToSitemapFormat(post.created_at),
      priority: 1,
    });
  });

  return result;
}
