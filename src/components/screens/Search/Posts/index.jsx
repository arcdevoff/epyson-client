'use client';
import Loading from '@/components/ui/Loading';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import styles from './SearchPosts.module.scss';
import { IconChevronDown } from '@tabler/icons-react';
import { PostService } from '@/services/post.service';
import PostCard from '@/components/templates/Post/Card';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import copyText from '@/utils/copyText';
import unixToDateTime from '@/utils/unixToDateTime';
import useIsVisible from '@/hooks/useIsVisible';
import PostLoader from '@/components/templates/Post/Card/Loader';

const limit = process.env.NEXT_PUBLIC_POSTS_LIMIT;
const SearchPosts = ({ query }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const [loaderRef, loaderVisible, onScroll] = useIsVisible(500, 100);
  const { status, data, error, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['search:posts', query],
      queryFn: async ({ pageParam }) => await PostService.search(pageParam),
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

  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  React.useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    if (loaderVisible) {
      fetchNextPage();
    }
  }, [loaderVisible, fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className={styles.root}>
      <div className={styles.title}>Посты</div>

      {status === 'pending' ? (
        Array(3)
          .fill()
          .map((_, key) => <PostLoader key={key} />)
      ) : status === 'error' ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          {data.pages.map((page) => (
            <React.Fragment key={page.nextPage}>
              {page.data.map((data, key) => (
                <PostCard
                  key={key}
                  data={data}
                  user={user.data}
                  refetch={refetch}
                  authorized={!!user?.accessToken}
                  info={data.info}
                  dispatch={dispatch}
                  copyText={copyText}
                  router={router}
                  unixToDateTime={unixToDateTime}
                />
              ))}
            </React.Fragment>
          ))}
        </>
      )}

      {hasNextPage && <div ref={loaderRef}>{loaderVisible && <Loading />}</div>}
    </div>
  );
};

export default SearchPosts;
