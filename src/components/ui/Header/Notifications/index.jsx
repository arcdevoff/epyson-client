'use client';
import { IconBell, IconReload } from '@tabler/icons-react';
import styles from './Notifications.module.scss';
import React from 'react';
import NotificationService from '@/services/notification.service';
import { useInfiniteQuery } from '@tanstack/react-query';
import Loading from '../../Loading';
import NotificationCard from '@/components/templates/Notification/Card';
import useIsVisible from '@/hooks/useIsVisible';
import unixToDateTime from '@/utils/unixToDateTime';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, setWindow } from '@/redux/reducers/ui/slice';
import Image from 'next/image';
import Empty from '../../Empty';
import { usePathname } from 'next/navigation';
import NotificationLoader from '@/components/templates/Notification/Card/Loader';

const limit = 6;
const Notifications = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);
  const showWindow = useSelector((state) => state.ui.window.notifications.isOpen);
  const pathname = usePathname();
  const [info, setInfo] = React.useState(null);
  const [loaderRef, loaderVisible, onScroll] = useIsVisible(100, 100);
  const { status, data, error, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ['notifications', showWindow],
      queryFn: async ({ pageParam }) => {
        if (showWindow) {
          const data = await NotificationService.getAll(pageParam);

          if (info?.unread) {
            setInfo({ ...info, unread: null });
            dispatch(
              setWindow({
                window: 'notifications',
                data: { isOpen: showWindow, data: { unread: null } },
              }),
            );
          }

          return data;
        } else {
          return false;
        }
      },
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

  const onClikcShowWindow = () => {
    if (!!accessToken) {
      dispatch(setWindow({ window: 'notifications', data: { isOpen: !showWindow } }));
    } else {
      dispatch(setModal({ modal: 'auth', data: { login: { isOpen: true } } }));
    }
  };

  React.useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    if (loaderVisible) {
      fetchNextPage();
    }
  }, [loaderVisible, fetchNextPage, hasNextPage, isFetchingNextPage]);

  React.useEffect(() => {
    if (!!accessToken) {
      NotificationService.getInfo().then((data) => {
        setInfo(data);
        dispatch(
          setWindow({
            window: 'notifications',
            data: { isOpen: showWindow, data: { unread: data.unread } },
          }),
        );
      });
    }
  }, [accessToken]);

  React.useEffect(() => {
    dispatch(setWindow({ window: 'notifications', data: { isOpen: false } }));
  }, [pathname, dispatch]);

  return (
    <div className={`${styles.root} scroll`}>
      <button
        onClick={onClikcShowWindow}
        onBlur={() => dispatch(setWindow({ window: 'notifications', data: { isOpen: false } }))}
        className={`btn-secondary ${styles.showBtn}`}>
        {info?.unread > 0 && <div className={styles.unread}>{info.unread}</div>}

        <IconBell />
      </button>

      {showWindow && (
        <div className={styles.window}>
          <div className={styles.header}>
            <div className={styles.title}>Уведомления</div>
            <div className={styles.actions}>
              <button
                onMouseDown={(e) => e.preventDefault()}
                className={styles.refetchButton}
                onClick={() => refetch()}>
                <IconReload />
              </button>
            </div>
          </div>

          <div onScroll={onScroll} className={`${styles.list} scroll`}>
            {status === 'pending' ? (
              Array(3)
                .fill()
                .map((_, key) => <NotificationLoader key={key} />)
            ) : status === 'error' ? (
              <p>Error: {error.message}</p>
            ) : (
              <>
                {data.pages.map((page) => (
                  <React.Fragment key={page.nextPage}>
                    {page.data.map((data, key) => (
                      <NotificationCard unixToDateTime={unixToDateTime} data={data} key={key} />
                    ))}
                  </React.Fragment>
                ))}
              </>
            )}

            {status === 'success' && !data.pages[0].data.length && (
              <Empty
                text="Нет уведомлений"
                image="/images/emojis/face-with-monocle.webp"
                imageWidth={68}
                imageHeight={68}
              />
            )}

            {hasNextPage && (
              <div ref={loaderRef}>{loaderVisible && <Loading type={'circle'} />}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
