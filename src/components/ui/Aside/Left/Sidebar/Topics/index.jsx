import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { TopicService } from '@/services/topic.service';
import styles from './SidebarTopics.module.scss';
import React from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import ContentLoader from 'react-content-loader';

const limit = 8;
const SidebarTopics = () => {
  const pathname = usePathname();
  const { status, data, error, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['topics'],
      queryFn: async ({ pageParam }) => await TopicService.getAllSidebar(pageParam),
      initialPageParam: { page: 1, limit },
      refetchOnWindowFocus: false,
      retry: 1,
      getNextPageParam: (lastPage) => {
        if (lastPage.nextPage) {
          return { page: lastPage.nextPage, limit };
        } else {
          return undefined;
        }
      },
    });

  return (
    <div className={styles.root}>
      <span className={styles.title}>
        Темы{' '}
        <Link href="/topics" onMouseDown={(e) => e.preventDefault()}>
          все темы
        </Link>
      </span>

      {status === 'pending' ? (
        Array(3)
          .fill()
          .map((_, key) => (
            <ContentLoader
              speed={2}
              key={key}
              width="100%"
              height={34}
              style={{ marginLeft: 7, marginTop: 3 }}
              backgroundColor="#b7b7b730"
              foregroundColor="#6d6d6d30">
              <rect x="0" y="0" rx="100" ry="100" width="28" height="28" />
              <rect x="38" y="8" rx="4" ry="4" width="75%" height="13" />
            </ContentLoader>
          ))
      ) : status === 'error' ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          {data.pages.map((page) => (
            <React.Fragment key={page.nextPage}>
              {page.data.map((obj, key) => (
                <Link
                  onMouseDown={(e) => e.preventDefault()}
                  className={`${styles.topic} ${
                    pathname === `/topic/${obj.slug}` ? styles.active : ''
                  }`}
                  key={key}
                  href={`/topic/${obj.slug}`}>
                  <Image quality={100} src={obj.avatar} width={28} height={28} alt={obj.name} />
                  <span>{obj.name.length > 11 ? obj.name.substr(0, 11) + '...' : obj.name}</span>
                </Link>
              ))}
            </React.Fragment>
          ))}

          {hasNextPage && (
            <button
              onMouseDown={(e) => e.preventDefault()}
              className={styles.showMoreButton}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}>
              {isFetchingNextPage
                ? 'Загрузка...'
                : hasNextPage && (
                    <>
                      <IconChevronDown /> Показать еще
                    </>
                  )}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SidebarTopics;
