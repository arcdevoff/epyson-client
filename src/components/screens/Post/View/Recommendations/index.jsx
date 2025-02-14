import { useDispatch, useSelector } from 'react-redux';
import styles from './PostRecommendations.module.scss';
import { useRouter } from 'next/navigation';
import useIsVisible from '@/hooks/useIsVisible';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import PostCard from '@/components/templates/Post/Card';
import Loading from '@/components/ui/Loading';
import { PostService } from '@/services/post.service';
import unixToDateTime from '@/utils/unixToDateTime';
import copyText from '@/utils/copyText';
import Image from 'next/image';
import PostLoader from '@/components/templates/Post/Card/Loader';

const limit = process.env.NEXT_PUBLIC_POSTS_LIMIT;
const PostRecommendations = ({ postId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const [loaderRef, loaderVisible, onScroll] = useIsVisible(500, 100);
  const { status, data, error, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['post:recommendations', postId],
      queryFn: async ({ pageParam }) => await PostService.getRecommendationsById(pageParam),
      initialPageParam: { page: 1, limit, id: postId },
      refetchOnWindowFocus: false,
      retry: 2,
      getNextPageParam: (lastPage) => {
        if (lastPage.nextPage) {
          return { page: lastPage.nextPage, limit, id: postId };
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
      <div className={styles.title}>
        <Image src="/images/emojis/fire.webp" width={25} height={25} alt="fire" /> Рекомендации
      </div>

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

export default PostRecommendations;
