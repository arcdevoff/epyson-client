'use client';
import Loading from '@/components/ui/Loading';
import { UserService } from '@/services/user.service';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import styles from './SearchUsers.module.scss';
import Image from 'next/image';
import { IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';
import ContentLoader from 'react-content-loader';

const limit = 6;
const SearchUsers = ({ query }) => {
  const { status, data, error, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['search:users', query],
    queryFn: async ({ pageParam }) => await UserService.search(pageParam),
    initialPageParam: { page: 1, limit, query },
    refetchOnWindowFocus: false,
    retry: 2,
    getNextPageParam: (lastPage) => {
      if (lastPage.nextPage) {
        return { page: lastPage.nextPage, limit, query };
      } else {
        return undefined;
      }
    },
  });

  return (
    <div className={styles.root}>
      <div className={styles.title}>Блоги</div>

      {status === 'pending' ? (
        Array(3)
          .fill()
          .map((_, key) => (
            <ContentLoader
              speed={2}
              key={key}
              width="100%"
              height={43}
              style={{ marginBottom: 10 }}
              backgroundColor="#b7b7b730"
              foregroundColor="#6d6d6d30">
              <rect x="0" y="0" rx="100" ry="100" width="43" height="43" />
              <rect x="51" y="9" rx="4" ry="4" width="85" height="11" />
              <rect x="51" y="26" rx="4" ry="4" width="120" height="11" />
            </ContentLoader>
          ))
      ) : status === 'error' ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          {data.pages.map((page) => (
            <React.Fragment key={page.nextPage}>
              {page.data.map((data, key) => (
                <div key={key} className={styles.item}>
                  <Link className={styles.avatar} href={`/user/${data.id}`}>
                    <Image src={data.avatar} width={43} height={43} alt="avatar" />
                  </Link>

                  <div className={styles.info}>
                    <Link href={`/user/${data.id}`} className={styles.name}>
                      {data.name}
                    </Link>
                    <span className={styles.subscribers}>
                      {data.subscribers}{' '}
                      {Number(data.subscribers) === 1 ? 'подписчик' : 'подписчиков'}
                    </span>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}
        </>
      )}

      {hasNextPage && (
        <button
          className={styles.showMoreButton}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}>
          {isFetchingNextPage
            ? 'Загрузка...'
            : hasNextPage && (
                <>
                  Показать еще <IconChevronDown />
                </>
              )}
        </button>
      )}
    </div>
  );
};

export default SearchUsers;
