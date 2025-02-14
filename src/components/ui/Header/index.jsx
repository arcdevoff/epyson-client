'use client';
import styles from './Header.module.scss';
import Link from 'next/link';
import { IconMenu2, IconPlus } from '@tabler/icons-react';
import React from 'react';
import UserMenu from './UserMenu';
import Notifications from './Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { setModal, setShowSidebar } from '@/redux/reducers/ui/slice';
import HeaderSearch from './Search';
import { TopicService } from '@/services/topic.service';
import { setTopics } from '@/redux/reducers/topic/slice';

const Header = () => {
  const dispatch = useDispatch();
  const { showSidebar } = useSelector((state) => state.ui);
  const { accessToken } = useSelector((state) => state.user);

  const onClickCreatePost = () => {
    if (accessToken) {
      dispatch(setModal({ modal: 'post', data: { create: { isOpen: true } } }));
    } else {
      dispatch(setModal({ modal: 'auth', data: { login: { isOpen: true } } }));
    }
  };

  React.useEffect(() => {
    TopicService.getAll().then((data) => {
      dispatch(setTopics(data));
    });
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        <button
          onBlur={() => dispatch(setShowSidebar(false))}
          onClick={() => dispatch(setShowSidebar(!showSidebar))}
          className={styles.controlSidebarBtn}>
          <IconMenu2 />
        </button>

        <div className={styles.logo}>
          <Link href="/">EPYSON</Link>
        </div>
      </div>

      <div className={styles.center}>
        <HeaderSearch />
      </div>

      <div className={styles.right}>
        <button onClick={onClickCreatePost} className={`btn-primary ${styles.createPostButton}`}>
          <IconPlus />
          <span>Создать</span>
        </button>
        <Notifications />
        <UserMenu />
      </div>
    </div>
  );
};

export default Header;
