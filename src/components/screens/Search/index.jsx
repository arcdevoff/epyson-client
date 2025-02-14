'use client';
import { IconSearch } from '@tabler/icons-react';
import styles from './Search.module.scss';
import React, { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import SearchUsers from './Users';
import debounce from 'lodash.debounce';
import SearchPosts from './Posts';
import Loading from '@/components/ui/Loading';

const Search = () => {
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState(searchParams.get('query') || '');
  const [searchInputValue, setSearchInputValue] = React.useState(query);

  const globalUpdateQuery = React.useCallback(
    debounce((value) => {
      setQuery(value);
    }, 400),
    [],
  );

  const searchInputValueChange = (e) => {
    setSearchInputValue(e.target.value);
    globalUpdateQuery(e.target.value);
  };

  React.useEffect(() => {
    const q = searchParams.get('query') || '';

    setQuery(q);
    setSearchInputValue(q);
  }, [searchParams]);

  return (
    <div className={styles.root}>
      <div className={styles.search}>
        <IconSearch width={24} height={24} />
        <input placeholder="Поиск" value={searchInputValue} onChange={searchInputValueChange} />
      </div>

      <SearchUsers query={query} />
      <SearchPosts query={query} />
    </div>
  );
};

const SearchWithSuspense = () => (
  <Suspense fallback={<Loading />}>
    <Search />
  </Suspense>
);

export default SearchWithSuspense;
