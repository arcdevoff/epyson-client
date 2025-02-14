'use client';
import PostCard from '@/components/templates/Post/Card';
import Loading from '@/components/ui/Loading';
import useIsVisible from '@/hooks/useIsVisible';
import copyText from '@/utils/copyText';
import unixToDateTime from '@/utils/unixToDateTime';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './UserFeed.module.scss';
import { UserService } from '@/services/user.service';
import MainPopover from '@/components/ui/Main/Popover';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import Empty from '@/components/ui/Empty';
import PostLoader from '@/components/templates/Post/Card/Loader';

const limit = process.env.NEXT_PUBLIC_POSTS_LIMIT;
const UserFeed = ({ id }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const router = useRouter();
  const [loaderRef, loaderVisible, onScroll] = useIsVisible(500, 100);
  const [filterShow, setFilterShow] = React.useState(false);
  const [filter, setFilter] = React.useState('new');
  const { status, data, error, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [`user:${id}:feed`, filter],
      queryFn: async ({ pageParam }) => await UserService.getFeed(pageParam),
      initialPageParam: { page: 1, limit, id, filter },
      refetchOnWindowFocus: false,
      retry: 2,
      getNextPageParam: (lastPage) => {
        if (lastPage.nextPage) {
          return { page: lastPage.nextPage, limit, id, filter };
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
      {status === 'success' && !Boolean(data.pages[0].data.length) && (
        <Empty
          image="/images/emojis/disappointed-face.webp"
          imageHeight={68}
          imageWidth={68}
          text="Здесь пока ничего нет"
        />
      )}

      {status === 'success' && Boolean(data.pages[0].data.length) && (
        <button
          onBlur={() => setFilterShow(false)}
          onClick={() => setFilterShow(!filterShow)}
          className={styles.filter}>
          {filter === 'popular' && 'Популярное'}
          {filter === 'new' && 'Свежее'}

          {filterShow ? <IconChevronUp /> : <IconChevronDown />}
        </button>
      )}

      {filterShow && (
        <MainPopover
          rootStyle={{ left: 10, top: 30 }}
          options={[
            {
              active: filter === 'new',
              text: 'Свежее',
              onClick: () => setFilter('new'),
            },
            {
              active: filter === 'popular',
              text: 'Популярное',
              onClick: () => setFilter('popular'),
            },
          ]}
        />
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

export default UserFeed;
