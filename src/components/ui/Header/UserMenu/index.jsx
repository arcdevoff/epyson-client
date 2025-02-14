'use client';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import styles from './UserMenu.module.scss';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, setWindow } from '@/redux/reducers/ui/slice';
import useUser from '@/hooks/useUser';
import Image from 'next/image';
import { useParams, usePathname, useRouter } from 'next/navigation';

const UserMenu = () => {
  const showWindow = useSelector((state) => state.ui.window.user.menu.isOpen);
  const dispatch = useDispatch();
  const { user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const menuItems = [
    {
      name: 'Настройки',
      icon: <IconSettings style={{ marginLeft: -2.52 }} />,
      onClick: () => router.push('/user/settings'),
    },
    {
      name: 'Выйти',
      icon: <IconLogout />,
      onClick: () => logout(),
    },
  ];

  const onClikcShowWindow = () => {
    if (user?.id) {
      dispatch(setWindow({ window: 'user', data: { menu: { isOpen: !showWindow } } }));
    } else {
      dispatch(setModal({ modal: 'auth', data: { login: { isOpen: true } } }));
    }
  };

  React.useEffect(() => {
    dispatch(setWindow({ window: 'user', data: { menu: { isOpen: false } } }));
  }, [pathname, dispatch]);

  return (
    <div className={styles.root}>
      <button
        onBlur={() => dispatch(setWindow({ window: 'user', data: { menu: { isOpen: false } } }))}
        onClick={onClikcShowWindow}
        className={`btn-secondary ${styles.showBtn}`}>
        <IconUser />
      </button>

      {showWindow && user?.id && (
        <div className={styles.window}>
          <div
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => router.push('/user/' + user.id)}
            className={styles.profile}>
            <Image
              src={user.avatar}
              width={65}
              height={65}
              alt="avatar"
              className={styles.avatar}
            />

            <div>
              <span className={styles.title}>{user.name}</span>
              <span className={styles.subtitle}>Перейти в профиль</span>
            </div>
          </div>

          <div className={styles.menu}>
            {menuItems.map((obj, key) => (
              <button
                key={key}
                onClick={obj.onClick}
                onMouseDown={(e) => e.preventDefault()}
                className={styles.item}>
                {obj.icon}
                <span className={styles.label}>{obj.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
