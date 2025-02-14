'use client';
import { IconBell, IconHome, IconSearch, IconUser } from '@tabler/icons-react';
import styles from './TabBar.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { setModal, setWindow } from '@/redux/reducers/ui/slice';

const TabBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.user.accessToken);
  const unreadNotifications = useSelector((state) => state.ui.window.notifications.data?.unread);
  const isOpenNotifications = useSelector((state) => state.ui.window.notifications?.isOpen);
  const isOpenUserMenu = useSelector((state) => state.ui.window.user.menu?.isOpen);

  const items = [
    {
      active: pathname === '/' && !isOpenNotifications && !isOpenUserMenu,
      onClick: () => router.push('/'),
      icon: <IconHome />,
      onBlur: () => '',
    },
    {
      active: pathname === '/search' && !isOpenNotifications && !isOpenUserMenu,
      onClick: () => router.push('/search'),
      icon: <IconSearch />,
      onBlur: () => '',
    },
    {
      active: isOpenNotifications,
      onClick: () => onClikcShowNotifications(),
      // onBlur: () =>
      //   dispatch(
      //     setWindow({
      //       window: 'notifications',
      //       data: { isOpen: false, data: { unread: unreadNotifications } },
      //     }),
      //   ),
      icon: <IconBell />,
      counter: unreadNotifications,
    },
    {
      onClick: () => onClikcShowUserMenu(),
      onBlur: () => dispatch(setWindow({ window: 'user', data: { menu: { isOpen: false } } })),
      active: isOpenUserMenu,
      icon: <IconUser />,
    },
  ];

  const onClikcShowNotifications = () => {
    if (!!accessToken) {
      dispatch(
        setWindow({
          window: 'notifications',
          data: { isOpen: !isOpenNotifications, data: { unread: unreadNotifications } },
        }),
      );
    } else {
      dispatch(setModal({ modal: 'auth', data: { login: { isOpen: true } } }));
    }
  };

  const onClikcShowUserMenu = () => {
    if (!!accessToken) {
      dispatch(setWindow({ window: 'user', data: { menu: { isOpen: !isOpenUserMenu } } }));
    } else {
      dispatch(setModal({ modal: 'auth', data: { login: { isOpen: true } } }));
    }
  };

  return (
    <div className={styles.root}>
      {items.map((obj, key) => (
        <button
          key={key}
          className={`${styles.item} ${obj.active ? styles.active : ''}`}
          onClick={obj.onClick}
          onBlur={obj.onBlur}>
          {obj.icon}

          {obj.counter > 0 && <span className={styles.counter}>{obj.counter}</span>}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
