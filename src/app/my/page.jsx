import FeedMy from '@/components/screens/Feed/My';

export const metadata = {
  title: 'Моя лента — ' + process.env.NEXT_PUBLIC_SITENAME,
  openGraph: {
    title: 'Моя лента — ' + process.env.NEXT_PUBLIC_SITENAME,
  },
};

const FeedMyPage = () => {
  return <FeedMy />;
};

export default FeedMyPage;
