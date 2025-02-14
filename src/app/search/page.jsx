import Search from '@/components/screens/Search';

export const metadata = {
  title: 'Поиск — ' + process.env.NEXT_PUBLIC_SITENAME,
  openGraph: {
    title: 'Поиск — ' + process.env.NEXT_PUBLIC_SITENAME,
  },
};

const SearchPage = () => {
  return <Search />;
};

export default SearchPage;
