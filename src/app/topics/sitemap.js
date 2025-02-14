import axios from 'axios';

export default async function sitemap() {
  const result = [];

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/topics/all', {
    cache: 'no-store',
  });
  const data = await res.json();

  data.map((topic) => {
    result.push({
      url: process.env.NEXT_PUBLIC_DOMAIN + '/topic/' + topic.slug,
      lastModified: new Date(),
    });
  });

  return result;
}
