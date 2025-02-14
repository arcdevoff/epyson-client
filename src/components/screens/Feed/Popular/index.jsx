'use client';
import PostCard from '@/components/templates/Post/Card';
import PostLoader from '@/components/templates/Post/Card/Loader';
import Empty from '@/components/ui/Empty';
import Loading from '@/components/ui/Loading';
import useIsVisible from '@/hooks/useIsVisible';
import FeedService from '@/services/feed.service';
import copyText from '@/utils/copyText';
import unixToDateTime from '@/utils/unixToDateTime';
import { useInfiniteQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const limit = process.env.NEXT_PUBLIC_POSTS_LIMIT;
const FeedPopular = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const [loaderRef, loaderVisible, onScroll] = useIsVisible(500, 100);
  const { status, data, error, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['feed:popular'],
      queryFn: async ({ pageParam }) => await FeedService.popular(pageParam),
      initialPageParam: { page: 1, limit },
      refetchOnWindowFocus: false,
      retry: 2,
      getNextPageParam: (lastPage) => {
        if (lastPage.nextPage) {
          return { page: lastPage.nextPage, limit };
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
    <div>
      {status === 'success' && !Boolean(data.pages[0].data.length) && (
        <>
          <Empty
            text="Лента постов из тем, на которые вы подписались"
            image="/images/emojis/thinking-face.webp"
            imageWidth={70}
            imageHeight={70}
          />

          <Link
            href={'/topics'}
            className="btn-secondary"
            style={{
              display: 'block',
              fontSize: 17,
              padding: '12px 40px',
              fontWeight: 600,
              width: 'fit-content',
              margin: '2.3rem auto',
              textAlign: 'center',
            }}>
            Темы
          </Link>
        </>
      )}

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

export default FeedPopular;
