import TopicsAll from '@/components/screens/Topic/All';

export const metadata = {
  title: 'Все темы — ' + process.env.NEXT_PUBLIC_SITENAME,
  openGraph: {
    title: 'Все темы — ' + process.env.NEXT_PUBLIC_SITENAME,
  },
};

const TopicsAllPage = () => {
  return <TopicsAll />;
};

export default TopicsAllPage;
