import FeedPopular from '@/components/screens/Feed/Popular';

export const metadata = {
  title: 'Популярное — ' + process.env.NEXT_PUBLIC_SITENAME,
  openGraph: {
    title: 'Популярное — ' + process.env.NEXT_PUBLIC_SITENAME,
  },
};

export default function HomePage() {
  return <FeedPopular />;
}
