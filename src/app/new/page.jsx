import FeedNew from '@/components/screens/Feed/New';

export const metadata = {
  title: 'Свежее — ' + process.env.NEXT_PUBLIC_SITENAME,
  openGraph: {
    title: 'Свежее — ' + process.env.NEXT_PUBLIC_SITENAME,
  },
};

const FeedNewPage = async () => {
  return <FeedNew />;
};

export default FeedNewPage;
